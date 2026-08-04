export const tradingViewScriptUrl = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';

const mockedPages = new WeakSet();

export async function mockTradingView(page) {
  if (mockedPages.has(page)) return;
  mockedPages.add(page);

  await page.route(tradingViewScriptUrl, async (route) => {
    await route.fulfill({
      contentType: 'application/javascript; charset=utf-8',
      body: `(() => {
        const script = document.currentScript;
        const config = JSON.parse(script.textContent || '{}');
        window.__tradingViewConfigs = [...(window.__tradingViewConfigs || []), config];
        window.__tradingViewLoaderExecutions = (window.__tradingViewLoaderExecutions || 0) + 1;
        const iframe = document.createElement('iframe');
        iframe.title = 'Mock TradingView Advanced Chart';
        iframe.src = 'about:blank';
        const mount = script.parentElement.querySelector('[data-tradingview-mount]');
        mount.replaceChildren(iframe);
        setTimeout(() => iframe.dispatchEvent(new Event('load')), 0);
      })();`
    });
  });
}
