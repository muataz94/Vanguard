import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const targetViewports = [
  [320, 568], [360, 800], [390, 844], [430, 932], [768, 1024],
  [1024, 768], [1280, 800], [1366, 768], [1440, 900], [1920, 1080]
];
const tradingViewScriptUrl = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
const mockedTradingViewPages = new WeakSet();

async function mockTradingView(page) {
  if (mockedTradingViewPages.has(page)) return;
  mockedTradingViewPages.add(page);
  await page.route(tradingViewScriptUrl, async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `(() => {
        const script = document.currentScript;
        const config = JSON.parse(script.textContent);
        window.__tradingViewConfigs = [...(window.__tradingViewConfigs || []), config];
        const iframe = document.createElement('iframe');
        iframe.title = 'Mock TradingView advanced chart';
        iframe.src = 'about:blank';
        script.parentElement.insertBefore(iframe, script);
        setTimeout(() => iframe.dispatchEvent(new Event('load')), 0);
      })();`
    });
  });
}

function watchPage(page) {
  const errors = [];
  const failures = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => failures.push(`${request.url()} — ${request.failure()?.errorText}`));
  return { errors, failures };
}

async function openLanding(page) {
  await mockTradingView(page);
  const response = await page.goto('/Vanguard/', { waitUntil: 'networkidle' });
  expect(response?.status()).toBe(200);
  await page.waitForTimeout(700);
}

test('home, assets, navigation, pricing and WhatsApp are production-ready', async ({ page }) => {
  const diagnostics = watchPage(page);
  await openLanding(page);

  await expect(page).toHaveTitle(/مؤشر فانگارد/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.brand img').first()).toBeVisible();
  expect(await page.locator('.brand img').first().evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator('.brand img').first().evaluate((image) => image.currentSrc)).not.toContain('/Vanguard/Vanguard/');

  await expect(page.locator('.indicator-preview img')).toBeVisible();
  await expect(page.locator('.indicator-preview img')).toHaveAttribute('src', /images\/vanguard-indicator-preview\.png$/);
  await expect(page.locator('canvas[data-vanguard-abstract]')).toHaveCount(0);
  await expect(page.getByText('المعلومة كثيرة. المطلوب هو ترتيبها', { exact: true })).toHaveCount(0);
  await expect(page.locator('.section-transition-host, .market-scroll-effect, .pin-spacer')).toHaveCount(0);
  expect(await page.locator('html').evaluate((node) => getComputedStyle(node).scrollSnapType)).toBe('none');

  await expect(page.locator('#pricing-grid .price-card')).toHaveCount(4);
  await expect(page.locator('[data-plan="one-month"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*95/);
  await expect(page.locator('.dev-warning')).toHaveCount(0);
  await expect(page.locator('[data-plan="three-months"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*199/);
  await expect(page.locator('[data-plan="six-months"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*450/);
  await expect(page.locator('[data-plan="annual"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*795/);
  const whatsappLinks = page.locator('a[href*="wa.me"]');
  expect(await whatsappLinks.count()).toBeGreaterThanOrEqual(5);
  for (const link of await whatsappLinks.all()) await expect(link).toHaveAttribute('href', /^https:\/\/wa\.me\/9647717220578\?text=/);

  const benefitsLink = page.locator('.primary-nav a[href="#benefits"]');
  await benefitsLink.click();
  await expect(page).toHaveURL(/#benefits$/);
  await expect(page.locator('#benefits-title')).toBeInViewport();
  await expect(benefitsLink).toHaveAttribute('aria-current', 'location');

  await page.locator('.hero a[href="#demo"]').click();
  await expect(page).toHaveURL(/#demo$/);
  await expect(page.locator('#demo-title')).toBeInViewport();
  await page.locator('[data-demo-step="context"]').click();
  await expect(page.locator('[data-demo-step="context"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-demo-step="context"]')).toHaveAttribute('aria-controls', 'demo-step-copy');
  await expect(page.locator('#demo-step-copy')).toHaveAttribute('role', 'tabpanel');
  await expect(page.locator('#demo-step-copy')).toHaveText('راجع اتجاه السوق والإطار الزمني ونقطة الإلغاء قبل تقييم الإشارة.');
  await page.locator('[data-demo-step="context"]').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('[data-demo-step="alert"]')).toHaveAttribute('aria-selected', 'true');

  const market = page.locator('[role="tab"][id="market-tab-1"]');
  await market.click();
  await expect(market).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#market-detail')).toHaveAttribute('aria-labelledby', 'market-tab-1');
  await expect(page.locator('#market-detail-title')).toHaveText('العملات الرقمية');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#market-tab-2')).toHaveAttribute('aria-selected', 'true');

  expect(diagnostics.errors).toEqual([]);
  expect(diagnostics.failures).toEqual([]);
});

test('no visitor-facing placeholder or unverified evidence content is exposed', async ({ page }) => {
  await openLanding(page);
  const bodyText = await page.locator('body').innerText();
  const forbidden = [
    'support@example.com', '[يجب الاستكمال قبل النشر]', 'REAL PRODUCT DEMO REQUIRED',
    'بانتظار مثال حقيقي', 'مثال محايد مطلوب', 'مثال خاسر مطلوب',
    'سيتم إضافة فيديو', 'استبدل هذا المحتوى', 'تنبيه قبل النشر'
  ];
  forbidden.forEach((text) => expect(bodyText).not.toContain(text));
  await expect(page.locator('#evidence')).toBeHidden();
  await expect(page.locator('#testimonials')).toHaveCount(0);
  await expect(page.locator('#risk-title')).toBeVisible();
});

test('typography uses the three-font system without undersized meaningful text', async ({ page }) => {
  await openLanding(page);
  await page.evaluate(() => document.fonts?.ready);
  const families = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    heading: getComputedStyle(document.querySelector('h1')).fontFamily,
    cardTitle: getComputedStyle(document.querySelector('.benefit-card h3')).fontFamily,
    navigation: getComputedStyle(document.querySelector('.primary-nav')).fontFamily
  }));
  expect(families.body).toContain('Fustat');
  expect(families.heading).toContain('Alexandria');
  expect(families.cardTitle).toContain('Alexandria');
  expect(families.navigation).toContain('Readex Pro');

  const undersized = await page.locator('body *:not([data-tradingview-widget] *)').evaluateAll((nodes) => nodes
    .filter((node) => [...node.childNodes].some((child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim()))
    .filter((node) => {
      const style = getComputedStyle(node);
      return style.display !== 'none' && style.visibility !== 'hidden';
    })
    .map((node) => ({ tag: node.tagName, className: node.className, text: node.textContent.trim().slice(0, 80), size: parseFloat(getComputedStyle(node).fontSize) }))
    .filter(({ size }) => size < 13.9));
  expect(undersized).toEqual([]);
});

test('downward and reverse scrolling leave every revealed group usable', async ({ page }) => {
  await openLanding(page);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 520) {
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(45);
  }
  await page.evaluate((bottom) => window.scrollTo(0, bottom), height);
  await page.waitForTimeout(850);
  const revealedAfterDown = await page.locator('.motion-group').evaluateAll((nodes) => nodes.map((node) => ({
    opacity: Number(getComputedStyle(node).opacity),
    visibility: getComputedStyle(node).visibility
  })));
  expect(revealedAfterDown.every(({ opacity, visibility }) => opacity > .99 && visibility === 'visible')).toBeTruthy();

  for (let y = height; y >= 0; y -= 640) {
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(35);
  }
  const revealedAfterUp = await page.locator('.motion-group').evaluateAll((nodes) => nodes.map((node) => Number(getComputedStyle(node).opacity)));
  expect(revealedAfterUp.every((opacity) => opacity > .99)).toBeTruthy();
  await expect(page.locator('h1')).toBeVisible();
});

test('reduced motion renders complete static content without WebGL', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const diagnostics = watchPage(page);
  await openLanding(page);
  await expect(page.locator('canvas[data-vanguard-abstract]')).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-motion-mode', 'static');
  await expect(page.locator('[data-tradingview-hero]')).toHaveAttribute('data-widget-state', 'ready');
  await expect(page.locator('[data-tradingview-widget] iframe')).toHaveCount(1);
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('.indicator-preview img')).toBeVisible();
  const states = await page.locator('.motion-group, .indicator-preview').evaluateAll((nodes) => nodes.map((node) => ({ opacity: getComputedStyle(node).opacity, transform: getComputedStyle(node).transform })));
  expect(states.every(({ opacity, transform }) => opacity === '1' && transform === 'none')).toBeTruthy();
  expect(diagnostics.errors).toEqual([]);
  expect(diagnostics.failures).toEqual([]);
  await context.close();
});

test('theme follows the system, toggles accessibly and persists', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  const page = await context.newPage();
  await openLanding(page);
  const toggle = page.locator('[data-theme-toggle]');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(toggle).toHaveAttribute('aria-label', 'تفعيل الوضع الداكن');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await context.close();
});

test('hero uses the official TradingView configuration and reinitializes once per theme', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const diagnostics = watchPage(page);
  await openLanding(page);
  const chart = page.locator('[data-tradingview-hero]');
  await expect(chart).toHaveAttribute('data-widget-state', 'ready');
  await expect(page.locator('[data-tradingview-widget] iframe')).toHaveCount(1);
  await expect(page.locator('[data-tradingview-widget] script')).toHaveCount(1);
  const config = await page.evaluate(() => window.__tradingViewConfigs[0]);
  expect(config).toEqual(expect.objectContaining({
    autosize: true,
    symbol: 'OANDA:XAUUSD',
    interval: '1',
    timezone: 'Etc/UTC',
    style: '1',
    locale: 'en',
    withdateranges: true,
    allow_symbol_change: false,
    save_image: false,
    calendar: false,
    hide_side_toolbar: false,
    hide_top_toolbar: false,
    support_host: 'https://www.tradingview.com'
  }));
  expect(config.studies).toBeUndefined();
  const initialTheme = await chart.getAttribute('data-widget-theme');
  await page.locator('[data-theme-toggle]').click();
  await expect(chart).not.toHaveAttribute('data-widget-theme', initialTheme);
  await expect(chart).toHaveAttribute('data-widget-init-count', '2');
  await expect(page.locator('[data-tradingview-widget] iframe')).toHaveCount(1);
  await expect(page.locator('[data-tradingview-widget] script')).toHaveCount(1);
  await expect(page.locator('.hero-chart__action')).toHaveAttribute('href', 'https://www.tradingview.com/script/eyqTPbol-NEW-VANGUARD-INDICATOR/');
  await expect(page.locator('#hero-chart-clarification')).toHaveText('الرسم التفاعلي لعرض حركة السوق — افتح المؤشر على TradingView لعرض إشارات Vanguard.');
  await expect(page.locator('#hero-chart-risk')).toHaveText('أداة تحليلية مساعدة وليست توصية مالية أو ضماناً للنتائج.');
  expect(diagnostics.errors).toEqual([]);
  expect(diagnostics.failures).toEqual([]);
});

test('hero chart exposes a useful fallback when TradingView is unavailable', async ({ page }) => {
  await page.route(tradingViewScriptUrl, (route) => route.abort('failed'));
  await page.goto('/Vanguard/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-tradingview-hero]')).toHaveAttribute('data-widget-state', 'error');
  await expect(page.locator('[data-tradingview-error]')).toBeVisible();
  await expect(page.locator('[data-tradingview-error] a')).toHaveAttribute('href', 'https://www.tradingview.com/script/eyqTPbol-NEW-VANGUARD-INDICATOR/');
  await expect(page.locator('h1')).toBeVisible();
});

test('mobile menu traps focus, closes with Escape and keeps actions reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLanding(page);
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.primary-nav a').first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.mobile-action-bar')).toBeVisible();
  await expect(page.locator('[data-mobile-contact]')).toHaveAttribute('href', /^https:\/\/wa\.me\/9647717220578\?text=/);
});

test('keyboard landmarks and FAQ ARIA behavior work', async ({ page }) => {
  await openLanding(page);
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.locator('.faq-question').first()).toHaveAttribute('aria-expanded', 'true');
  const question = page.locator('.faq-question').nth(1);
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.faq-answer').nth(1)).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'false');
  const levels = await page.locator('h1, h2, h3').evaluateAll((headings) => headings.filter((heading) => !heading.closest('[hidden]')).map((heading) => Number(heading.tagName[1])));
  expect(levels[0]).toBe(1);
  expect(levels.every((level, index) => index === 0 || level - levels[index - 1] <= 1)).toBeTruthy();
});

for (const [width, height] of targetViewports) {
  test(`no horizontal overflow at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openLanding(page);
    const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  });
}

test('layout remains usable at a 200% zoom equivalent', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 720 });
  await openLanding(page);
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  await expect(page.locator('.menu-toggle')).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
});

test('scroll-to-top control returns focusable content to the page start', async ({ page }) => {
  await openLanding(page);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('.scroll-top')).toBeVisible();
  await page.locator('.scroll-top').click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
});

for (const route of ['privacy.html', 'terms.html', 'refund.html', 'risk-disclosure.html', '404.html']) {
  test(`${route} opens directly with valid project-base assets`, async ({ page }) => {
    const diagnostics = watchPage(page);
    const response = await page.goto(`/Vanguard/${route}`, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    expect((await page.locator('body').innerText())).not.toContain('[يجب الاستكمال قبل النشر]');
    if (route !== '404.html') await expect(page.locator('[data-whatsapp]').first()).toHaveAttribute('href', /^https:\/\/wa\.me\/9647717220578\?text=/);
    else await expect(page.getByRole('link', { name: 'العودة إلى الصفحة الرئيسية' })).toBeVisible();
    expect(diagnostics.errors).toEqual([]);
    expect(diagnostics.failures).toEqual([]);
  });
}

test('normal scroll avoids long blocking tasks', async ({ page }) => {
  await openLanding(page);
  await page.locator('.indicator-preview img').waitFor({ state: 'attached' });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    window.__vanguardLongTasks = [];
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => window.__vanguardLongTasks.push(...list.getEntries().map((entry) => entry.duration)));
      observer.observe({ type: 'longtask', buffered: false });
    }
  });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 420) {
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(25);
  }
  const durations = await page.evaluate(() => window.__vanguardLongTasks || []);
  expect(Math.max(0, ...durations)).toBeLessThan(200);
});

test('capture required responsive section screenshots', async ({ browser, baseURL }) => {
  test.setTimeout(120_000);
  const artifactDirectory = resolve('artifacts');
  await mkdir(artifactDirectory, { recursive: true });

  const captures = [
    ['hero', '.hero'],
    ['benefits', '#benefits'],
    ['workflow', '#how-it-works'],
    ['demo', '#demo'],
    ['pricing', '#pricing'],
    ['faq', '#faq'],
    ['final-cta', '.final-cta'],
    ['footer', '.site-footer']
  ];

  for (const [device, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }]
  ]) {
    const context = await browser.newContext({ viewport, locale: 'ar-IQ', colorScheme: 'dark', reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(`${baseURL}/Vanguard/`, { waitUntil: 'networkidle' });
    for (const [name, selector] of captures) {
      const target = page.locator(selector);
      await target.scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      await target.screenshot({ path: resolve('artifacts', `security-revamp-${device}-${name}.png`) });
    }
    await context.close();
  }
});
