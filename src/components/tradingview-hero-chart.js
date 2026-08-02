const WIDGET_SCRIPT_URL = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
const LOAD_TIMEOUT_MS = 15000;

function getWidgetTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function createWidgetConfig(theme) {
  return {
    autosize: true,
    symbol: 'OANDA:XAUUSD',
    interval: '1',
    timezone: 'Etc/UTC',
    theme,
    style: '1',
    locale: 'en',
    withdateranges: true,
    allow_symbol_change: false,
    save_image: false,
    calendar: false,
    hide_side_toolbar: false,
    hide_top_toolbar: false,
    support_host: 'https://www.tradingview.com'
  };
}

export function initTradingViewHeroChart(frame) {
  const widget = frame?.querySelector('[data-tradingview-widget]');
  const mount = frame?.querySelector('[data-tradingview-mount]');
  const loading = frame?.querySelector('[data-tradingview-loading]');
  const error = frame?.querySelector('[data-tradingview-error]');
  if (!frame || !widget || !mount || !loading || !error) return () => {};

  let activeTheme;
  let generation = 0;
  let timeoutId;
  let iframeObserver;
  let themeUpdateQueued = false;
  let disposed = false;

  const setState = (state) => {
    frame.dataset.widgetState = state;
    loading.hidden = state !== 'loading';
    error.hidden = state !== 'error';
    widget.hidden = state === 'error';
  };

  const clearWidget = () => {
    window.clearTimeout(timeoutId);
    iframeObserver?.disconnect();
    widget.querySelectorAll('script[data-tradingview-loader], iframe').forEach((node) => node.remove());
    mount.replaceChildren();
  };

  const initialize = () => {
    if (disposed) return;
    const theme = getWidgetTheme();
    if (activeTheme === theme && frame.dataset.widgetState !== 'error') return;

    activeTheme = theme;
    generation += 1;
    const currentGeneration = generation;
    clearWidget();
    setState('loading');
    frame.dataset.widgetTheme = theme;
    frame.dataset.widgetInitCount = String(Number(frame.dataset.widgetInitCount || 0) + 1);

    const markReady = () => {
      if (disposed || currentGeneration !== generation) return;
      window.clearTimeout(timeoutId);
      setState('ready');
    };
    const markError = () => {
      if (disposed || currentGeneration !== generation) return;
      clearWidget();
      setState('error');
    };
    const observeIframe = () => {
      const iframe = widget.querySelector('iframe');
      if (!iframe) return false;
      iframe.addEventListener('load', markReady, { once: true });
      return true;
    };

    iframeObserver = new MutationObserver(() => {
      if (observeIframe()) iframeObserver.disconnect();
    });
    iframeObserver.observe(widget, { childList: true, subtree: true });

    const script = document.createElement('script');
    script.src = WIDGET_SCRIPT_URL;
    script.async = true;
    script.dataset.tradingviewLoader = '';
    script.textContent = JSON.stringify(createWidgetConfig(theme));
    script.addEventListener('error', markError, { once: true });
    widget.append(script);
    observeIframe();

    timeoutId = window.setTimeout(markError, LOAD_TIMEOUT_MS);
  };

  const themeObserver = new MutationObserver(() => {
    if (themeUpdateQueued || getWidgetTheme() === activeTheme) return;
    themeUpdateQueued = true;
    queueMicrotask(() => {
      themeUpdateQueued = false;
      initialize();
    });
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  initialize();

  return () => {
    disposed = true;
    generation += 1;
    themeObserver.disconnect();
    clearWidget();
  };
}
