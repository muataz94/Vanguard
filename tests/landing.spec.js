import { test, expect } from '@playwright/test';

test('homepage content, pricing, FAQ and placeholder contact are correct', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/مؤشر فانگارد/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('#risk-title')).toBeVisible();
  await expect(page.locator('#pricing-grid .price-card')).toHaveCount(4);
  await expect(page.locator('[data-plan="annual"] .price-badge')).toHaveText('أفضل قيمة');
  await expect(page.locator('[data-plan="six-months"] .dev-warning')).toBeVisible();
  await expect(page.locator('.whatsapp-float')).toHaveAttribute('href', /^https:\/\/wa\.me\/9647717220578\?text=/);
  await expect(page.locator('[data-plan="one-month"] .price-action')).toBeEnabled();
  await expect(page.locator('[data-plan="one-month"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*95/);
  await expect(page.locator('[data-plan="three-months"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*199/);
  await expect(page.locator('[data-plan="six-months"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*450/);
  await expect(page.locator('[data-plan="annual"] .price-action')).toHaveAttribute('href', /wa\.me\/9647717220578.*795/);
  const faqButton = page.locator('.faq-question').first();
  await faqButton.click();
  await expect(faqButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.faq-answer').first()).toBeVisible();
  await page.locator('.play-button').click();
  await expect(page.locator('.video-explainer')).toBeVisible();
  await expect(page.locator('.play-button')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('.video-explainer__close').click();
  await expect(page.locator('.video-explainer')).toBeHidden();
  await page.locator('#markets-list button').nth(1).click();
  await expect(page.locator('#markets-list button').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#market-detail-title')).toHaveText('العملات الرقمية');
  await page.locator('.benefit-card').first().hover();
  await expect(page.locator('.ui-tooltip')).toBeVisible();
  await expect(page.locator('.ui-tooltip')).not.toHaveText('');
  await expect(page.locator('#three-scene canvas')).toBeAttached();
  const fontFamily = await page.locator('body').evaluate((node) => getComputedStyle(node).fontFamily);
  expect(fontFamily).toContain('Fustat');
  expect(errors).toEqual([]);
});

test('mobile menu traps focus and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.primary-nav')).toHaveClass(/is-open/);
  await expect(page.locator('.primary-nav a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.mobile-action-bar')).toBeVisible();
  await expect(page.locator('[data-mobile-contact]')).toHaveAttribute('href', /^https:\/\/wa\.me\/9647717220578\?text=/);
});

test('tablet navigation and two-column content remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  await expect(page.locator('.menu-toggle')).toBeVisible();
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.primary-nav')).toHaveClass(/is-open/);
  await expect(page.locator('.primary-nav a[href="#pricing"]').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.primary-nav')).not.toHaveClass(/is-open/);
});

test('scroll progress, sticky header and return-to-top control are wired', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * .55));
  await expect(page.locator('.site-header')).toHaveClass(/is-scrolled/);
  await expect(page.locator('.scroll-top')).toHaveClass(/is-visible/);
  const progressTransform = await page.locator('.scroll-progress span').evaluate((node) => getComputedStyle(node).transform);
  expect(progressTransform).not.toBe('none');
  await expect(page.locator('.market-scroll-value b')).not.toHaveText('00');
  expect(await page.locator('.market-scroll-candles g.is-active').count()).toBeGreaterThan(1);
  await page.locator('.scroll-top').click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(20);
});

test('keyboard navigation, accordion semantics and heading order are valid', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  const faqButton = page.locator('.faq-question').nth(2);
  await faqButton.focus();
  await page.keyboard.press('Enter');
  await expect(faqButton).toHaveAttribute('aria-expanded', 'true');
  const levels = await page.locator('h1, h2, h3').evaluateAll((headings) => headings.filter((heading) => !heading.closest('[hidden]')).map((heading) => Number(heading.tagName[1])));
  expect(levels[0]).toBe(1);
  expect(levels.every((level, index) => index === 0 || level - levels[index - 1] <= 1)).toBeTruthy();
});

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`layout has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const sizes = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth + 1);
  });
}

test('reduced motion keeps static fallback and skips canvas', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await expect(page.locator('#three-scene canvas')).toHaveCount(0);
  await context.close();
});

for (const route of ['/privacy.html', '/terms.html', '/refund.html', '/risk-disclosure.html', '/404.html']) {
  test(`${route} renders directly without runtime errors`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    if (route !== '/404.html') await expect(page.locator('[data-whatsapp]')).toHaveAttribute('href', /^https:\/\/wa\.me\/9647717220578\?text=/);
    expect(errors).toEqual([]);
  });
}
