/**
 * @typedef {Object} MarketInstrument
 * @property {string} id
 * @property {string} symbol
 * @property {string} [nameKey]
 * @property {number[]} values Deterministic demonstration coordinates, never live prices.
 * @property {boolean} [benchmark]
 */

/**
 * @typedef {Object} MarketCategory
 * @property {'forex'|'crypto'|'stocks'|'indicators'} id
 * @property {string} labelKey
 * @property {string} shortKey
 * @property {string} titleKey
 * @property {string} descriptionKey
 * @property {string} eyebrow
 * @property {'paths'|'candles'|'sparklines'|'oscillator'} visualization
 * @property {string} accent
 * @property {MarketInstrument[]} instruments
 */

/** @type {MarketCategory[]} */
export const marketCategories = [
  {
    id: 'forex', labelKey: 'markets.forex.label', shortKey: 'markets.forex.short', titleKey: 'markets.forex.title',
    descriptionKey: 'markets.forex.description', eyebrow: 'FOREX / REVIEW', visualization: 'paths', accent: 'green',
    instruments: [
      { id: 'eurusd', symbol: 'EUR/USD', values: [58, 51, 54, 42, 47, 36, 39, 29, 34, 22] },
      { id: 'gbpusd', symbol: 'GBP/USD', values: [44, 48, 39, 43, 35, 41, 32, 37, 27, 31] },
      { id: 'usdjpy', symbol: 'USD/JPY', values: [62, 56, 59, 49, 53, 45, 48, 39, 43, 35] },
      { id: 'audusd', symbol: 'AUD/USD', values: [49, 54, 50, 57, 51, 46, 49, 41, 44, 38] }
    ]
  },
  {
    id: 'crypto', labelKey: 'markets.crypto.label', shortKey: 'markets.crypto.short', titleKey: 'markets.crypto.title',
    descriptionKey: 'markets.crypto.description', eyebrow: 'CRYPTO / REVIEW', visualization: 'candles', accent: 'blue',
    instruments: [
      { id: 'btc', nameKey: 'markets.item.bitcoin', symbol: 'BTC/USD', values: [55, 44, 50, 36, 46, 30, 39, 24, 33, 20] },
      { id: 'eth', nameKey: 'markets.item.ethereum', symbol: 'ETH/USD', values: [48, 54, 42, 47, 35, 43, 38, 27, 34, 29] },
      { id: 'doge', nameKey: 'markets.item.dogecoin', symbol: 'DOGE/USD', values: [61, 47, 57, 39, 53, 35, 48, 30, 43, 26] },
      { id: 'sol', nameKey: 'markets.item.solana', symbol: 'SOL/USD', values: [52, 41, 46, 33, 39, 28, 36, 23, 30, 18] }
    ]
  },
  {
    id: 'stocks', labelKey: 'markets.stocks.label', shortKey: 'markets.stocks.short', titleKey: 'markets.stocks.title',
    descriptionKey: 'markets.stocks.description', eyebrow: 'STOCKS / REVIEW', visualization: 'sparklines', accent: 'amber',
    instruments: [
      { id: 'aapl', nameKey: 'markets.item.apple', symbol: 'AAPL', values: [55, 51, 46, 49, 40, 35, 38, 29, 32, 24] },
      { id: 'googl', nameKey: 'markets.item.alphabet', symbol: 'GOOGL', values: [48, 52, 45, 43, 38, 41, 33, 30, 26, 28] },
      { id: 'nvda', nameKey: 'markets.item.nvidia', symbol: 'NVDA', values: [62, 54, 58, 46, 49, 37, 42, 31, 35, 21] },
      { id: 'ndx', nameKey: 'markets.item.nasdaq', symbol: 'NDX', values: [51, 48, 50, 43, 45, 39, 40, 34, 36, 30], benchmark: true }
    ]
  },
  {
    id: 'indicators', labelKey: 'markets.indicators.label', shortKey: 'markets.indicators.short', titleKey: 'markets.indicators.title',
    descriptionKey: 'markets.indicators.description', eyebrow: 'INDICATORS / REVIEW', visualization: 'oscillator', accent: 'mint',
    instruments: [
      { id: 'vanguard', symbol: 'Vanguard Indicator', values: [56, 48, 52, 39, 44, 31, 38, 27, 34, 23] },
      { id: 'rsi', symbol: 'RSI', values: [54, 45, 59, 39, 50, 34, 46, 27, 41, 32] },
      { id: 'macd', symbol: 'MACD', values: [51, 56, 47, 42, 45, 36, 39, 30, 34, 25] }
    ]
  }
];
