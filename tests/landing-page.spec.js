import { test, expect } from '@playwright/test';
import { copyFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const targetViewports = [
  [320, 568], [360, 800], [390, 844], [430, 932], [768, 1024],
  [1024, 768], [1366, 768], [1440, 900], [1920, 1080]
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

  await expect(page.locator('.candle-bridge')).toHaveCount(4);
  await expect(page.locator('.section-candle-transition, .section-transition-host, .market-scroll-effect')).toHaveCount(0);
  for (const bridge of await page.locator('.candle-bridge').all()) {
    expect(await bridge.locator('.candle-bridge__candles > span').count()).toBeLessThanOrEqual(7);
    expect(await bridge.evaluate((node) => getComputedStyle(node).position)).toBe('relative');
  }

  await expect(page.locator('#pricing-grid .price-card')).toHaveCount(4);
  await expect(page.locator('[data-plan="one-month"] .price-action')).toBeDisabled();
  await expect(page.locator('.dev-warning')).toHaveCount(0);
  await expect(page.locator('[data-plan="three-months"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*199/);
  await expect(page.locator('[data-plan="six-months"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*450/);
  await expect(page.locator('[data-plan="annual"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*795/);
  const whatsappLinks = page.locator('a[href*="wa.me"]');
  expect(await whatsappLinks.count()).toBeGreaterThanOrEqual(5);
  for (const link of await whatsappLinks.all()) await expect(link).toHaveAttribute('href', /^https:\/\/wa\.me\/9647717220578\?text=/);

  await page.locator('.hero a[href="#demo"]').click();
  await expect(page).toHaveURL(/#demo$/);
  await expect(page.locator('#demo-title')).toBeInViewport();
  await page.locator('[data-demo-step="context"]').click();
  await expect(page.locator('[data-demo-step="context"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-demo-confirm]')).toHaveText('يتطلب تحققًا');

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

test('reduced motion renders complete static content without canvas', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const diagnostics = watchPage(page);
  await openLanding(page);
  await expect(page.locator('#three-scene canvas')).toHaveCount(0);
  await expect(page.locator('.scene-fallback')).toBeVisible();
  const states = await page.locator('.motion-group, .candle-bridge').evaluateAll((nodes) => nodes.map((node) => ({ opacity: getComputedStyle(node).opacity, transform: getComputedStyle(node).transform })));
  expect(states.every(({ opacity, transform }) => opacity === '1' && transform === 'none')).toBeTruthy();
  expect(diagnostics.errors).toEqual([]);
  expect(diagnostics.failures).toEqual([]);
  await context.close();
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
  const question = page.locator('.faq-question').first();
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.faq-answer').first()).toBeVisible();
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

for (const route of ['privacy.html', 'terms.html', 'refund.html', 'risk-disclosure.html', '404.html']) {
  test(`${route} opens directly with valid project-base assets`, async ({ page }) => {
    const diagnostics = watchPage(page);
    const response = await page.goto(`/Vanguard/${route}`, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    expect((await page.locator('body').innerText())).not.toContain('[يجب الاستكمال قبل النشر]');
    if (route !== '404.html') await expect(page.locator('[data-whatsapp]').first()).toHaveAttribute('href', /^https:\/\/wa\.me\/9647717220578\?text=/);
    expect(diagnostics.errors).toEqual([]);
    expect(diagnostics.failures).toEqual([]);
  });
}

test('normal scroll avoids long blocking tasks', async ({ page }) => {
  await openLanding(page);
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

test('capture required screenshots and reverse-scroll video', async ({ browser, baseURL }) => {
  test.setTimeout(120_000);
  const artifactDirectory = resolve('artifacts');
  const temporaryVideoDirectory = resolve('artifacts', '.video-temp');
  await mkdir(artifactDirectory, { recursive: true });
  await mkdir(temporaryVideoDirectory, { recursive: true });

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ar-IQ', colorScheme: 'dark' });
  const desktopPage = await desktop.newPage();
  await desktopPage.goto(`${baseURL}/Vanguard/`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1300);
  await desktopPage.screenshot({ path: resolve('artifacts', 'revamp-desktop-top.png') });
  await desktopPage.locator('#demo').scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(850);
  await desktopPage.screenshot({ path: resolve('artifacts', 'revamp-desktop-middle.png') });
  await desktopPage.locator('#pricing').scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(850);
  await desktopPage.screenshot({ path: resolve('artifacts', 'revamp-desktop-pricing.png') });
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ar-IQ', colorScheme: 'dark' });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${baseURL}/Vanguard/`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1300);
  await mobilePage.screenshot({ path: resolve('artifacts', 'revamp-mobile-top.png') });
  await mobilePage.locator('#pricing').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(700);
  await mobilePage.screenshot({ path: resolve('artifacts', 'revamp-mobile-pricing.png') });
  await mobile.close();

  const videoContext = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    locale: 'ar-IQ',
    colorScheme: 'dark',
    recordVideo: { dir: temporaryVideoDirectory, size: { width: 1366, height: 768 } }
  });
  const videoPage = await videoContext.newPage();
  await videoPage.goto(`${baseURL}/Vanguard/`, { waitUntil: 'networkidle' });
  await videoPage.waitForTimeout(900);
  const video = videoPage.video();
  for (const selector of ['.candle-bridge[data-chapter="01"]', '#demo', '.candle-bridge[data-chapter="03"]', '#pricing', '#faq']) {
    const targetY = await videoPage.locator(selector).evaluate((node) => node.getBoundingClientRect().top + window.scrollY - 80);
    while (await videoPage.evaluate(() => window.scrollY) < targetY - 40) {
      await videoPage.mouse.wheel(0, 420);
      await videoPage.waitForTimeout(85);
    }
    await videoPage.waitForTimeout(450);
  }
  for (let step = 0; step < 7; step += 1) {
    await videoPage.mouse.wheel(0, -520);
    await videoPage.waitForTimeout(100);
  }
  await videoPage.waitForTimeout(650);
  await videoContext.close();
  const recordedPath = await video.path();
  await copyFile(recordedPath, resolve('artifacts', 'revamp-scroll-test.webm'));
  await rm(temporaryVideoDirectory, { recursive: true, force: true });
});
