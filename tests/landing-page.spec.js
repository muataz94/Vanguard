import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { mockTradingView, tradingViewScriptUrl } from './tradingview-mock.js';

const targetViewports = [
  [320, 568], [360, 640], [360, 800], [390, 844], [430, 932], [768, 1024],
  [1024, 768], [1280, 800], [1366, 768], [1440, 900], [1920, 1080]
];
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

async function revealTradingView(page) {
  const panel = page.locator('[data-tradingview-chart]');
  await panel.scrollIntoViewIfNeeded();
  await expect(panel).toHaveAttribute('data-widget-state', 'ready');
  await expect(panel.locator('iframe')).toHaveCount(1);
  return panel;
}

test('home, assets, navigation, pricing and WhatsApp are production-ready', async ({ page }) => {
  const diagnostics = watchPage(page);
  await openLanding(page);

  await expect(page).toHaveTitle(/مؤشر فانگارد/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.hero-description p')).toHaveCount(3);
  await expect(page.locator('.primary-nav a[href="#pricing"]')).toHaveCount(1);
  expect((await page.locator('.primary-nav a:not(.button)').allTextContents()).join(' ')).not.toMatch(/الباقات|Packages/);
  await expect(page.locator('.hero-chart')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('+964 771 722 0578');
  await expect(page.locator('body')).not.toContainText('LuxAlgo');
  await expect(page.locator('.brand img').first()).toBeVisible();
  expect(await page.locator('.brand img').first().evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator('.brand img').first().evaluate((image) => image.currentSrc)).not.toContain('/Vanguard/Vanguard/');

  await expect(page.locator('[data-tradingview-widget]')).toHaveCount(1);
  await expect(page.locator('.hero [data-tradingview-chart]')).toHaveCount(1);
  await expect(page.locator('#demo [data-tradingview-chart], #demo iframe, #demo script[data-tradingview-loader]')).toHaveCount(0);
  await expect(page.locator('#demo .indicator-preview')).toHaveCount(1);
  await expect(page.locator('#demo .indicator-preview img')).toHaveAttribute('src', './images/vanguard-indicator-preview.png');
  await expect(page.locator('#demo .indicator-preview img')).toHaveAttribute('width', '1288');
  await expect(page.locator('#demo .indicator-preview img')).toHaveAttribute('height', '318');
  await expect(page.locator('#demo video, #demo canvas')).toHaveCount(0);
  await expect(page.locator('.risk-note + .tradingview-panel')).toHaveCount(1);
  const heroVisualOrder = await page.evaluate(() => {
    const risk = document.querySelector('.risk-note').getBoundingClientRect();
    const chart = document.querySelector('[data-tradingview-chart]').getBoundingClientRect();
    return { riskBottom: risk.bottom, chartTop: chart.top };
  });
  expect(heroVisualOrder.chartTop).toBeGreaterThan(heroVisualOrder.riskBottom);
  await revealTradingView(page);
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
  await expect(page.locator('#demo iframe, #demo [data-tradingview-widget]')).toHaveCount(0);
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

  const undersized = await page.locator('body *').evaluateAll((nodes) => nodes
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
  await expect(page.locator('.hero [data-tradingview-chart]')).toHaveCount(1);
  await expect(page.locator('[data-tradingview-widget]')).toHaveCount(1);
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('#demo .indicator-preview img')).toBeVisible();
  await revealTradingView(page);
  const states = await page.locator('.motion-group, .tradingview-panel').evaluateAll((nodes) => nodes.map((node) => ({ opacity: getComputedStyle(node).opacity, transform: getComputedStyle(node).transform })));
  expect(states.every(({ opacity, transform }) => opacity === '1' && transform === 'none')).toBeTruthy();
  const navbarMotion = await page.locator('.language-toggle').evaluate((node) => Math.max(...getComputedStyle(node, '::before').transitionDuration.split(',').map((value) => parseFloat(value) || 0)));
  expect(navbarMotion).toBeLessThanOrEqual(0.001);
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

test('hero copy, disclaimer, and following TradingView panel are bilingual', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const diagnostics = watchPage(page);
  await openLanding(page);
  await expect(page.locator('.hero-description p')).toHaveCount(3);
  await expect(page.locator('.risk-note')).toHaveText('أداة تحليلية مساعدة وليست توصية مالية أو ضماناً للنتائج. تحقق من كل إعداد وأدر المخاطر قبل التداول.');
  await expect(page.locator('.risk-note + [data-tradingview-chart]')).toHaveCount(1);
  await revealTradingView(page);
  await expect(page.locator('.hero iframe')).toHaveCount(1);
  await expect(page.locator('#demo iframe')).toHaveCount(0);
  await page.locator('[data-theme-toggle]').click();
  await page.locator('[data-language-option="en"]').click();
  await expect(page.locator('.hero-description p').first()).toContainText('Vanguard Indicator is an automated strategy');
  await expect(page.locator('.risk-note')).toHaveText('An analytical support tool, not financial advice or a guarantee of results. Verify every setup and manage risk before trading.');
  expect(diagnostics.errors).toEqual([]);
  expect(diagnostics.failures).toEqual([]);
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

for (const [width, height] of [[1440, 900], [1280, 800], [1024, 768]]) {
  test(`floating navbar zones and official brand lockup remain collision-free at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openLanding(page);
    await expect(page.locator('.menu-toggle')).toBeHidden();
    await expect(page.locator('.header-cta')).toBeVisible();
    await expect(page.locator('.nav-mobile-cta')).toBeHidden();
    const visiblePricingCtas = await page.locator('.site-header a[href="#pricing"]').evaluateAll((nodes) => nodes.filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    }).length);
    expect(visiblePricingCtas).toBe(1);
    await expect(page.locator('.brand img').first()).toHaveAttribute('src', './assets/vanguard-logo.png');
    const layout = await page.evaluate(() => {
      const box = (selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, center: rect.left + rect.width / 2 };
      };
      return {
        brand: box('.site-header .brand'),
        navigation: box('.nav-rail'),
        actions: box('.header-actions'),
        wordmark: box('.site-header .brand b'),
        descriptor: box('.site-header .brand small'),
        viewportCenter: innerWidth / 2
      };
    });
    const zones = [layout.brand, layout.navigation, layout.actions].sort((a, b) => a.left - b.left);
    expect(zones[1].left).toBeGreaterThanOrEqual(zones[0].right - 1);
    expect(zones[2].left).toBeGreaterThanOrEqual(zones[1].right - 1);
    expect(Math.abs(layout.navigation.center - layout.viewportCenter)).toBeLessThanOrEqual(2);
    expect(layout.descriptor.top).toBeGreaterThanOrEqual(layout.wordmark.bottom - 1);
  });
}

for (const [width, height] of [[430, 932], [390, 844], [360, 800]]) {
  test(`mobile navbar remains bounded and fully operable at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openLanding(page);
    const menu = page.locator('.primary-nav');
    const toggle = page.locator('.menu-toggle');
    await toggle.click();
    await expect(menu).toBeVisible();
    await expect(menu.locator('.nav-rail > a')).toHaveCount(4);
    await expect(menu.locator('a[href="#pricing"]')).toHaveCount(1);
    await expect(page.locator('.header-cta')).toBeHidden();
    await expect(page.locator('.nav-mobile-cta')).toBeVisible();
    const visiblePricingCtas = await page.locator('.site-header a[href="#pricing"]').evaluateAll((nodes) => nodes.filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    }).length);
    expect(visiblePricingCtas).toBe(1);
    const bounds = await menu.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: innerWidth, height: innerHeight };
    });
    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.right).toBeLessThanOrEqual(bounds.width);
    expect(bounds.top).toBeGreaterThanOrEqual(0);
    expect(bounds.bottom).toBeLessThanOrEqual(bounds.height);
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
  });
}

test('TradingView initializes lazily with an approved configuration and never duplicates', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openLanding(page);
  const panel = page.locator('[data-tradingview-chart]');
  await expect(page.locator('[data-tradingview-widget]')).toHaveCount(1);
  await revealTradingView(page);
  await expect(page.locator(`script[src="${tradingViewScriptUrl}"]`)).toHaveCount(1);
  const initial = await page.evaluate(() => ({
    count: window.__tradingViewLoaderExecutions,
    config: window.__tradingViewConfigs.at(-1)
  }));
  expect(initial.count).toBe(1);
  expect(initial.config).toMatchObject({
    autosize: true,
    symbol: 'OANDA:XAUUSD',
    interval: '60',
    timezone: 'Etc/UTC',
    style: '1',
    withdateranges: true,
    allow_symbol_change: true,
    save_image: false,
    calendar: false,
    hide_side_toolbar: false,
    hide_top_toolbar: false,
    support_host: 'https://www.tradingview.com'
  });
  expect(initial.config.studies).toBeUndefined();

  await page.locator('[data-language-option="en"]').click();
  expect(await page.evaluate(() => window.__tradingViewLoaderExecutions)).toBe(1);
  await expect(panel.locator('iframe')).toHaveCount(1);

  for (let index = 0; index < 3; index += 1) {
    await page.locator('[data-theme-toggle]').click();
    await expect(panel).toHaveAttribute('data-widget-state', 'ready');
    await expect(page.locator(`script[src="${tradingViewScriptUrl}"]`)).toHaveCount(1);
    await expect(panel.locator('iframe')).toHaveCount(1);
  }
  const lifecycle = await panel.evaluate((node) => ({
    initCount: Number(node.dataset.widgetInitCount),
    executions: window.__tradingViewLoaderExecutions
  }));
  expect(lifecycle.initCount).toBe(4);
  expect(lifecycle.executions).toBe(4);
  await expect(page.locator('.tradingview-widget-copyright')).toBeVisible();
  await expect(page.locator('.tradingview-widget-copyright a')).toHaveAttribute('rel', /noopener.*noreferrer.*nofollow/);
});

test('TradingView failure exposes an accessible fallback without breaking the page', async ({ page }) => {
  await page.route(tradingViewScriptUrl, (route) => route.abort('failed'));
  const response = await page.goto('/Vanguard/', { waitUntil: 'networkidle' });
  expect(response?.status()).toBe(200);
  const panel = page.locator('[data-tradingview-chart]');
  await panel.scrollIntoViewIfNeeded();
  await expect(panel).toHaveAttribute('data-widget-state', 'error');
  await expect(panel.locator('[data-tradingview-error]')).toBeVisible();
  await expect(panel.locator('iframe')).toHaveCount(0);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.tradingview-panel__action')).toBeVisible();
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
    const overflowing = await page.locator('h1, h2, h3, p, a, button, img, iframe, [role="tab"], [role="tabpanel"]').evaluateAll((nodes) => nodes
      .filter((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
      })
      .map((node) => ({ tag: node.tagName, className: node.className, text: node.textContent?.trim().slice(0, 60) })));
    expect(overflowing).toEqual([]);
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
  await revealTradingView(page);
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
    await mockTradingView(page);
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
