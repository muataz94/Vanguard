import { test, expect } from '@playwright/test';

async function mockTradingView(page) {
  await page.route('https://s3.tradingview.com/**', async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `(() => { const script = document.currentScript; const frame = document.createElement('iframe'); frame.title = 'TradingView demo'; frame.src = 'about:blank'; script.parentElement.append(frame); })();`
    });
  });
}

test('Arabic defaults, English persists, and theme state remains independent', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  const page = await context.newPage();
  await mockTradingView(page);
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
  await mockTradingView(page);
  await page.goto('/Vanguard/', { waitUntil: 'networkidle' });
  await page.locator('[data-language-toggle]').click();

  const cases = [
    { index: 0, id: 'forex', eyebrow: 'FOREX / REVIEW', title: 'Forex Market Review', instruments: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'] },
    { index: 1, id: 'crypto', eyebrow: 'CRYPTO / REVIEW', title: 'Cryptocurrency Review', instruments: ['BTC/USD', 'ETH/USD', 'DOGE/USD', 'SOL/USD'] },
    { index: 2, id: 'stocks', eyebrow: 'STOCKS / REVIEW', title: 'Stocks and Markets Review', instruments: ['AAPL', 'GOOGL', 'NVDA', 'NDX'] },
    { index: 3, id: 'indicators', eyebrow: 'INDICATORS / REVIEW', title: 'Indicator Review', instruments: ['Vanguard Indicator', 'LuxAlgo', 'RSI', 'MACD'] }
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
  await mockTradingView(page);
  await page.goto('/Vanguard/', { waitUntil: 'networkidle' });
  await page.locator('#market-tab-2').click();
  const duration = await page.locator('#market-detail').evaluate((node) => parseFloat(getComputedStyle(node).animationDuration) || 0);
  expect(duration).toBeLessThanOrEqual(0.001);
  await expect(page.locator('#market-detail')).toHaveAttribute('data-category', 'stocks');
  await context.close();
});
