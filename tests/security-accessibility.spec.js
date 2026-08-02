import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteConfig } from '../src/config.js';
import { sanitizeAnalyticsMetadata } from '../src/analytics.js';
import { buildPlanMessage, createWhatsAppUrl, getContactDestination } from '../src/components/contact.js';

const htmlPages = ['index.html', 'privacy.html', 'terms.html', 'refund.html', 'risk-disclosure.html', '404.html'];
const legalRoutes = ['privacy.html', 'terms.html', 'refund.html', 'risk-disclosure.html', '404.html'];
const tradingViewScriptUrl = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';

async function mockTradingView(page) {
  await page.route(tradingViewScriptUrl, async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `(() => {
        const script = document.currentScript;
        const iframe = document.createElement('iframe');
        iframe.title = 'Mock TradingView advanced chart';
        iframe.src = 'about:blank';
        script.parentElement.insertBefore(iframe, script);
        setTimeout(() => iframe.dispatchEvent(new Event('load')), 0);
      })();`
    });
  });
}

async function expectNoSeriousAxeViolations(page, route) {
  await mockTradingView(page);
  await page.goto(`/Vanguard/${route}`, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const violations = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

test('home page has no serious or critical Axe violations', async ({ page }) => {
  await expectNoSeriousAxeViolations(page, '');
});

for (const route of legalRoutes) {
  test(`${route} has no serious or critical Axe violations`, async ({ page }) => {
    await expectNoSeriousAxeViolations(page, route);
  });
}

test('normal navigation produces no CSP violations', async ({ page }) => {
  const violations = [];
  page.on('console', (message) => {
    if (/content security policy|violates the following/i.test(message.text())) {
      violations.push(message.text());
    }
  });
  await mockTradingView(page);
  await page.goto('/Vanguard/', { waitUntil: 'networkidle' });
  await page.locator('[data-demo-step="context"]').click();
  await page.locator('#market-tab-2').click();
  await page.locator('.faq-question').nth(2).click();
  const inlineStyles = await page.locator('[style]').evaluateAll((nodes) => nodes.map((node) => ({
    tag: node.tagName,
    className: node.getAttribute('class'),
    style: node.getAttribute('style')
  })));
  expect(violations, JSON.stringify({ inlineStyles }, null, 2)).toEqual([]);
  expect(inlineStyles).toEqual([]);
});

test('new-tab links always isolate their opener', async ({ page }) => {
  await mockTradingView(page);
  await page.goto('/Vanguard/', { waitUntil: 'networkidle' });
  const unsafe = await page.locator('a[target="_blank"]').evaluateAll((links) => links
    .filter((link) => {
      const tokens = new Set((link.getAttribute('rel') || '').split(/\s+/));
      return !tokens.has('noopener') || !tokens.has('noreferrer');
    })
    .map((link) => link.outerHTML));
  expect(unsafe).toEqual([]);
});

test('malformed contact configuration is rejected and contact actions disable safely', () => {
  const originalNumber = siteConfig.contact.whatsappNumber;
  const originalEmail = siteConfig.contact.email;
  try {
    siteConfig.contact.whatsappNumber = 'javascript:alert(1)';
    siteConfig.contact.email = '';
    expect(createWhatsAppUrl()).toBeNull();
    expect(getContactDestination()).toEqual({ kind: 'disabled' });
  } finally {
    siteConfig.contact.whatsappNumber = originalNumber;
    siteConfig.contact.email = originalEmail;
  }
});

test('configuration rendering code uses text nodes instead of executable HTML sinks', async () => {
  const renderingFiles = [
    'src/main.js',
    'src/legal.js',
    'src/components/evidence.js',
    'src/components/faq.js',
    'src/components/pricing.js'
  ];
  for (const file of renderingFiles) {
    const source = await readFile(resolve(file), 'utf8');
    expect(source, file).not.toMatch(/\b(?:innerHTML|outerHTML|insertAdjacentHTML)\b/);
    expect(source, file).toContain('textContent');
  }
});

test('analytics allowlist strips message bodies, phone numbers and identifiers', () => {
  const metadata = sanitizeAnalyticsMetadata({
    source_section: 'security_test',
    plan_id: 'one-month',
    message: 'private message body',
    phone_number: '9640000000000',
    tradingview_username: 'private-user'
  });
  expect(metadata).toEqual({ source_section: 'security_test', plan_id: 'one-month' });
});

test('contact helpers use only configured plans and an approved HTTPS origin', () => {
  const plan = siteConfig.pricing[0];
  const message = buildPlanMessage({ ...plan, labelAr: '<script>bad()</script>', priceUsd: 0 });
  expect(message).toContain(plan.labelAr);
  expect(message).toContain(String(plan.priceUsd));
  expect(message).not.toContain('<script>');
  const url = new URL(createWhatsAppUrl(message));
  expect(url.protocol).toBe('https:');
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe(`/${siteConfig.contact.whatsappNumber}`);
});

test('HTML uses restrictive meta CSP and contains no inline handlers or styles', async () => {
  for (const file of htmlPages) {
    const html = await readFile(resolve(file), 'utf8');
    expect(html, file).toContain('http-equiv="Content-Security-Policy"');
    expect(html, file).not.toMatch(/\son[a-z]+\s*=/i);
    expect(html, file).not.toMatch(/\sstyle\s*=/i);
    const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/i)?.[1] || '';
    expect(csp, file).toContain("object-src 'none'");
    expect(csp, file).toContain("form-action 'none'");
    expect(csp, file).not.toContain("'unsafe-inline'");
    expect(csp, file).not.toContain("'unsafe-eval'");
    if (file === 'index.html') {
      expect(csp).toContain('script-src');
      expect(csp).toContain('https://s3.tradingview.com');
      expect(csp).toContain('frame-src https://s.tradingview.com https://www.tradingview.com https://www.tradingview-widget.com');
    }
  }
});

test('production output contains no obvious secrets or environment files', async () => {
  const dist = resolve('dist');
  await access(dist);
  const files = await readdir(dist, { recursive: true });
  const textFiles = files.filter((file) => /\.(?:html|css|js|json|xml|txt)$/i.test(file));
  const secretPatterns = [
    /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/,
    /gh[pousr]_[A-Za-z0-9]{30,}/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /github[_-]?token\s*[:=]/i
  ];
  for (const file of textFiles) {
    const content = await readFile(resolve(dist, file), 'utf8');
    secretPatterns.forEach((pattern) => expect(content, file).not.toMatch(pattern));
    expect(content, file).not.toContain('__VANGUARD_');
  }
  expect(files.some((file) => /(^|[\\/])\.env(?:\.|$)/.test(file))).toBe(false);
});
