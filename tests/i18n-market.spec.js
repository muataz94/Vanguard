import { test, expect } from '@playwright/test';

test('Arabic defaults, English persists, and theme state remains independent', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto('/Vanguard/', { waitUntil: 'networkidle' });

  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('[data-language-toggle]')).toHaveAttribute('aria-label', 'تغيير اللغة إلى الإنجليزية');
  await expect(page.locator('#market-tab-0')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.market-detail__toolbar b')).toHaveText('FOREX / REVIEW');

  const themeBefore = await page.locator('html').getAttribute('data-theme');
  await page.locator('[data-language-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('#hero-title')).toContainText('Turn a crowded chart into');
  await expect(page.locator('[data-language-toggle]')).toHaveAttribute('aria-label', 'Switch language to Arabic');
  await expect(page.locator('html')).toHaveAttribute('data-theme', themeBefore);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('vanguard-language'))).toBe('en');
  await expect(page).toHaveTitle(/Vanguard Indicator/);

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('html')).toHaveAttribute('data-theme', themeBefore);
  await context.close();
});

test('market categories, instruments, keyboard controls, and repeated switching stay coherent', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/Vanguard/', { waitUntil: 'networkidle' });
  await page.locator('[data-language-toggle]').click();

  const cases = [
    { index: 0, id: 'forex', eyebrow: 'FOREX / REVIEW', title: 'Forex Market Review', instruments: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'] },
    { index: 1, id: 'crypto', eyebrow: 'CRYPTO / REVIEW', title: 'Cryptocurrency Review', instruments: ['BTC/USD', 'ETH/USD', 'DOGE/USD', 'SOL/USD'] },
    { index: 2, id: 'stocks', eyebrow: 'STOCKS / REVIEW', title: 'Stocks and Markets Review', instruments: ['AAPL', 'GOOGL', 'NVDA', 'NDX'] },
    { index: 3, id: 'indicators', eyebrow: 'INDICATORS / REVIEW', title: 'Indicator Review', instruments: ['Vanguard Indicator', 'RSI', 'MACD'] }
  ];

  for (const item of cases) {
    await page.locator(`#market-tab-${item.index}`).click();
    await expect(page.locator('#market-detail')).toHaveAttribute('data-category', item.id);
    await expect(page.locator('.market-detail__toolbar b')).toHaveText(item.eyebrow);
    await expect(page.locator('#market-detail h3')).toHaveText(item.title);
    const labels = await page.locator('.market-instruments button').allTextContents();
    item.instruments.forEach((instrument) => expect(labels.join(' ')).toContain(instrument));
    const second = page.locator('.market-instruments button').nth(1);
    await second.click();
    await expect(second).toHaveAttribute('aria-pressed', 'true');
  }

  await page.locator('#market-tab-1').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#market-detail')).toHaveAttribute('data-category', 'crypto');
  await page.keyboard.press('End');
  await expect(page.locator('#market-detail')).toHaveAttribute('data-category', 'indicators');
  await page.keyboard.press('Home');
  await expect(page.locator('#market-detail')).toHaveAttribute('data-category', 'forex');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#market-detail')).toHaveAttribute('data-category', 'crypto');

  for (let index = 0; index < 4; index += 1) await page.locator('[data-language-toggle]').click();
  const visibleText = await page.locator('body').innerText();
  expect(visibleText).not.toMatch(/(?:benefits|markets|pricing|faq)\.\d*\.?[a-z]+/i);
  expect(errors).toEqual([]);
});

test('reduced motion makes market updates immediate', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/Vanguard/', { waitUntil: 'networkidle' });
  await page.locator('#market-tab-2').click();
  const duration = await page.locator('#market-detail').evaluate((node) => parseFloat(getComputedStyle(node).animationDuration) || 0);
  expect(duration).toBeLessThanOrEqual(0.001);
  await expect(page.locator('#market-detail')).toHaveAttribute('data-category', 'stocks');
  await context.close();
});

test('hero spacing remains collision-free across the required viewport, language, and theme matrix', async ({ page }) => {
  await page.goto('/Vanguard/', { waitUntil: 'networkidle' });
  const viewports = [
    [1440, 900], [1280, 800], [1024, 768], [768, 1024], [430, 932], [390, 844], [360, 800]
  ];

  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    for (const language of ['ar', 'en']) {
      if (await page.locator('html').getAttribute('lang') !== language) await page.locator('[data-language-toggle]').click();
      for (const theme of ['dark', 'light']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('[data-theme-toggle]').click();
        const layout = await page.evaluate(() => {
          const rect = (selector) => {
            const box = document.querySelector(selector).getBoundingClientRect();
            return { top: box.top, bottom: box.bottom, left: box.left, right: box.right };
          };
          const paragraphs = [...document.querySelectorAll('.hero-description p')].map((node) => {
            const box = node.getBoundingClientRect();
            return { top: box.top, bottom: box.bottom };
          });
          return {
            eyebrow: rect('.hero .eyebrow'),
            title: rect('#hero-title'),
            firstTitleLine: rect('.hero-title-line:first-child'),
            secondTitleLine: rect('.hero-title-line:last-child'),
            description: rect('.hero-description'),
            buttons: rect('.hero .button-row'),
            paragraphs,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth
          };
        });
        expect(layout.title.top - layout.eyebrow.bottom).toBeGreaterThanOrEqual(12);
        expect(layout.secondTitleLine.top).toBeGreaterThanOrEqual(layout.firstTitleLine.bottom - 1);
        expect(layout.description.top - layout.title.bottom).toBeGreaterThanOrEqual(18);
        expect(layout.buttons.top - layout.description.bottom).toBeGreaterThanOrEqual(22);
        layout.paragraphs.slice(1).forEach((paragraph, index) => {
          expect(paragraph.top).toBeGreaterThanOrEqual(layout.paragraphs[index].bottom + 8);
        });
        expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
      }
    }
  }
});
