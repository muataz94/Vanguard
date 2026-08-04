const SVG_NS = 'http://www.w3.org/2000/svg';

function svgNode(tag, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
  return node;
}

function iconShell(categoryId) {
  const svg = svgNode('svg', {
    viewBox: '0 0 48 48',
    fill: 'none',
    'aria-hidden': 'true',
    focusable: 'false'
  });
  svg.classList.add('market-category-icon', `market-category-icon--${categoryId}`);
  return svg;
}

function forexIcon() {
  const svg = iconShell('forex');
  svg.append(
    svgNode('path', { d: 'M10 18c3-6 8-9 15-9 5 0 9 2 12 5', class: 'icon-exchange-arrow icon-exchange-arrow--top' }),
    svgNode('path', { d: 'm33 9 5 5-6 3', class: 'icon-arrow-head' }),
    svgNode('path', { d: 'M38 30c-3 6-8 9-15 9-5 0-9-2-12-5', class: 'icon-exchange-arrow icon-exchange-arrow--bottom' }),
    svgNode('path', { d: 'm15 39-5-5 6-3', class: 'icon-arrow-head' }),
    svgNode('path', { d: 'M20 18h8M20 24h8M22 30h4', class: 'icon-ticks' })
  );
  return svg;
}

function cryptoIcon() {
  const svg = iconShell('crypto');
  svg.append(
    svgNode('circle', { cx: 24, cy: 24, r: 10, class: 'icon-coin' }),
    svgNode('path', { d: 'M24 18v12M20 20h6a3 3 0 0 1 0 6h-6m0 0h7a3 3 0 0 1 0 6h-7', class: 'icon-coin-mark' }),
    svgNode('ellipse', { cx: 24, cy: 24, rx: 19, ry: 14, class: 'icon-orbit' }),
    svgNode('circle', { cx: 7, cy: 18, r: 2.2, class: 'icon-node icon-node--one' }),
    svgNode('circle', { cx: 40, cy: 30, r: 2.2, class: 'icon-node icon-node--two' })
  );
  return svg;
}

function stocksIcon() {
  const svg = iconShell('stocks');
  svg.append(
    svgNode('rect', { x: 9, y: 29, width: 6, height: 10, rx: 1, class: 'icon-bar icon-bar--one' }),
    svgNode('rect', { x: 20, y: 22, width: 6, height: 17, rx: 1, class: 'icon-bar icon-bar--two' }),
    svgNode('rect', { x: 31, y: 14, width: 6, height: 25, rx: 1, class: 'icon-bar icon-bar--three' }),
    svgNode('path', { d: 'm9 25 10-7 8 3 11-12', class: 'icon-stock-line' }),
    svgNode('path', { d: 'm33 9h5v5', class: 'icon-arrow-head' })
  );
  return svg;
}

function indicatorsIcon() {
  const svg = iconShell('indicators');
  svg.append(
    svgNode('path', { d: 'M7 17h34M7 32h34', class: 'icon-reference-lines' }),
    svgNode('path', { d: 'M7 27c5 0 6-11 11-11s6 17 11 17 6-12 12-12', class: 'icon-signal-line' }),
    svgNode('circle', { cx: 29, cy: 33, r: 2.5, class: 'icon-confirmation-dot' })
  );
  return svg;
}

const factories = { forex: forexIcon, crypto: cryptoIcon, stocks: stocksIcon, indicators: indicatorsIcon };

export function createMarketCategoryIcon(categoryId) {
  return (factories[categoryId] ?? indicatorsIcon)();
}
