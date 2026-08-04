import { marketCategories } from '../data/market-categories.js';
import { subscribeLanguage, t, translateElement } from '../i18n.js';
import { createMarketCategoryIcon } from './market-category-icons.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function svgElement(tag, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
  return node;
}

function pointAt(values, index, width = 420, height = 112) {
  return {
    x: Math.round(index * (width / (values.length - 1))),
    y: Math.round((values[index] / 72) * height)
  };
}

function linePath(values, width = 420, height = 112) {
  return values.map((_, index) => {
    const point = pointAt(values, index, width, height);
    return `${index ? 'L' : 'M'} ${point.x} ${point.y}`;
  }).join(' ');
}

function chartShell(className = '') {
  const svg = svgElement('svg', { viewBox: '0 0 420 112', preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false' });
  svg.classList.add('market-visual__svg');
  if (className) svg.classList.add(...className.split(/\s+/).filter(Boolean));
  [28, 56, 84].forEach((y) => svg.append(svgElement('line', { x1: 0, y1: y, x2: 420, y2: y, class: 'market-grid-line' })));
  return svg;
}

function renderForex(category, selectedId) {
  const wrapper = element('div', 'market-paths');
  const svg = chartShell('market-forex');
  category.instruments.forEach((instrument) => {
    svg.append(svgElement('path', {
      d: linePath(instrument.values),
      class: `market-line market-line--draw${instrument.id === selectedId ? ' is-selected' : ''}`,
      'data-series': instrument.id,
      pathLength: 1
    }));
    if (instrument.id === selectedId) {
      const focus = pointAt(instrument.values, 7);
      svg.append(svgElement('circle', { cx: focus.x, cy: focus.y, r: 5, class: 'market-focus-point' }));
    }
  });
  wrapper.append(svg, renderLegend(category, selectedId));
  return wrapper;
}

function renderLegend(category, selectedId) {
  const legend = element('div', 'market-paths__legend');
  category.instruments.forEach((instrument) => {
    const item = element('span', instrument.id === selectedId ? 'is-selected' : '');
    item.dir = 'ltr';
    item.append(element('i'), document.createTextNode(instrument.symbol));
    legend.append(item);
  });
  return legend;
}

function volatilityBand(values) {
  const upper = values.map((value) => Math.max(8, value - 9));
  const lower = values.map((value) => Math.min(68, value + 11));
  const top = upper.map((_, index) => {
    const point = pointAt(upper, index);
    return `${index ? 'L' : 'M'} ${point.x} ${point.y}`;
  }).join(' ');
  const bottom = lower.map((_, reverseIndex) => {
    const index = lower.length - reverseIndex - 1;
    const point = pointAt(lower, index);
    return `L ${point.x} ${point.y}`;
  }).join(' ');
  return `${top} ${bottom} Z`;
}

function renderCrypto(instrument) {
  const wrapper = element('div', 'market-crypto');
  const svg = chartShell('market-candles');
  svg.prepend(svgElement('path', { d: volatilityBand(instrument.values), class: 'market-volatility-band' }));
  [[56, 19, 3], [344, 25, 4], [386, 86, 3], [96, 91, 2.5]].forEach(([cx, cy, r]) => {
    svg.append(svgElement('circle', { cx, cy, r, class: 'market-network-node' }));
  });
  instrument.values.slice(0, 9).forEach((value, index) => {
    const next = instrument.values[index + 1];
    const x = 22 + index * 45;
    const top = Math.min(value, next);
    const height = Math.max(8, Math.abs(next - value));
    const rising = next < value;
    const candleClass = `${rising ? 'candle-up' : 'candle-down'} market-candle`;
    svg.append(svgElement('line', { x1: x + 8, y1: Math.max(5, top - 9), x2: x + 8, y2: Math.min(106, top + height + 10), class: candleClass }));
    svg.append(svgElement('rect', { x, y: top, width: 16, height, rx: 2, class: candleClass }));
  });
  const label = element('span', 'market-visual-label', instrument.symbol);
  label.dir = 'ltr';
  wrapper.append(svg, label);
  return wrapper;
}

function renderSparklines(category, selectedId) {
  const rows = element('div', 'market-sparklines');
  category.instruments.forEach((instrument) => {
    const row = element('div', `market-sparkline${instrument.id === selectedId ? ' is-selected' : ''}`);
    const label = element('span');
    const name = instrument.nameKey ? t(instrument.nameKey) : instrument.symbol;
    label.append(element('b', '', name), element('small', '', instrument.symbol));
    if (instrument.benchmark) translateElement(label.appendChild(element('em')), 'markets.benchmark');
    const svg = svgElement('svg', { viewBox: '0 0 420 72', preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false' });
    svg.append(svgElement('path', { d: linePath(instrument.values, 420, 72), pathLength: 1 }));
    row.append(label, svg);
    rows.append(row);
  });
  return rows;
}

function renderVanguard(instrument) {
  const svg = chartShell('market-indicator market-indicator--vanguard');
  svg.append(
    svgElement('rect', { x: 35, y: 18, width: 125, height: 76, rx: 5, class: 'market-trend-zone market-trend-zone--muted' }),
    svgElement('rect', { x: 228, y: 12, width: 150, height: 82, rx: 5, class: 'market-trend-zone' }),
    svgElement('path', { d: linePath(instrument.values), class: 'market-line market-line--draw is-selected', pathLength: 1 })
  );
  [3, 6, 8].forEach((index) => {
    const point = pointAt(instrument.values, index);
    svg.append(svgElement('circle', { cx: point.x, cy: point.y, r: 5, class: 'market-signal-dot' }));
  });
  return svg;
}

function renderRsi(instrument) {
  const svg = chartShell('market-indicator market-indicator--rsi');
  svg.append(
    svgElement('rect', { x: 0, y: 8, width: 420, height: 18, class: 'market-zone' }),
    svgElement('rect', { x: 0, y: 86, width: 420, height: 18, class: 'market-zone' }),
    svgElement('line', { x1: 0, y1: 26, x2: 420, y2: 26, class: 'market-reference-line' }),
    svgElement('line', { x1: 0, y1: 86, x2: 420, y2: 86, class: 'market-reference-line' }),
    svgElement('path', { d: linePath(instrument.values), class: 'market-line market-line--draw is-selected', pathLength: 1 })
  );
  return svg;
}

function renderMacd(instrument) {
  const svg = chartShell('market-indicator market-indicator--macd');
  instrument.values.slice(0, 9).forEach((value, index) => {
    const x = 12 + index * 47;
    const height = Math.max(5, Math.abs(46 - value));
    svg.append(svgElement('rect', {
      x, y: value < 46 ? 56 - height : 56, width: 20, height,
      class: value < 46 ? 'market-histogram market-histogram--positive' : 'market-histogram'
    }));
  });
  const signalValues = instrument.values.map((value, index) => Math.max(10, Math.min(66, value + (index % 2 ? -5 : 6))));
  svg.append(
    svgElement('path', { d: linePath(instrument.values), class: 'market-macd-line market-macd-line--primary market-line--draw', pathLength: 1 }),
    svgElement('path', { d: linePath(signalValues), class: 'market-macd-line market-macd-line--signal market-line--draw', pathLength: 1 })
  );
  return svg;
}

function renderIndicator(instrument) {
  const shell = element('div', `market-oscillator market-oscillator--${instrument.id}`);
  if (instrument.id === 'rsi') shell.append(renderRsi(instrument));
  else if (instrument.id === 'macd') shell.append(renderMacd(instrument));
  else shell.append(renderVanguard(instrument));
  const label = element('span', 'market-visual-label', instrument.symbol);
  label.dir = 'ltr';
  shell.append(label);
  return shell;
}

function renderVisualization(category, instrument) {
  if (category.visualization === 'candles') return renderCrypto(instrument);
  if (category.visualization === 'sparklines') return renderSparklines(category, instrument.id);
  if (category.visualization === 'oscillator') return renderIndicator(instrument);
  return renderForex(category, instrument.id);
}

export function renderMarketExplorer(container) {
  if (!container) return () => {};
  let categoryId = 'forex';
  const selections = Object.fromEntries(marketCategories.map((category) => [category.id, category.instruments[0].id]));

  const render = ({ focusTab = false, focusInstrument = false } = {}) => {
    const category = marketCategories.find((candidate) => candidate.id === categoryId) ?? marketCategories[0];
    const selectedId = selections[category.id];
    const instrument = category.instruments.find((candidate) => candidate.id === selectedId) ?? category.instruments[0];
    container.replaceChildren();

    const tablist = element('div', 'market-pills motion-group');
    tablist.id = 'markets-list';
    tablist.setAttribute('role', 'tablist');
    translateElement(tablist, 'markets.tabsAria', 'aria-label');

    marketCategories.forEach((candidate, index) => {
      const active = candidate.id === category.id;
      const button = element('button', active ? 'is-active' : '');
      button.type = 'button';
      button.id = `market-tab-${index}`;
      button.dataset.categoryId = candidate.id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(active));
      button.setAttribute('aria-controls', 'market-detail');
      button.tabIndex = active ? 0 : -1;
      const top = element('span');
      top.append(createMarketCategoryIcon(candidate.id), element('b', '', `0${index + 1}`));
      button.append(top, translateElement(element('strong'), candidate.labelKey), translateElement(element('small'), candidate.shortKey));
      button.addEventListener('click', () => {
        categoryId = candidate.id;
        render({ focusTab: true });
      });
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Enter' || event.key === ' ') {
          categoryId = candidate.id;
          render({ focusTab: true });
          return;
        }
        const rtl = document.documentElement.dir === 'rtl';
        let next = index;
        if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = marketCategories.length - 1;
        else {
          const forward = event.key === 'ArrowRight' ? !rtl : rtl;
          next = (index + (forward ? 1 : -1) + marketCategories.length) % marketCategories.length;
        }
        categoryId = marketCategories[next].id;
        render({ focusTab: true });
      });
      tablist.append(button);
    });

    const panel = element('div', `market-detail market-detail--${category.accent}`);
    panel.id = 'market-detail';
    panel.dataset.category = category.id;
    panel.setAttribute('role', 'tabpanel');
    const categoryIndex = marketCategories.findIndex((candidate) => candidate.id === category.id);
    panel.setAttribute('aria-labelledby', `market-tab-${categoryIndex}`);
    panel.tabIndex = 0;

    const copy = element('div', 'market-detail__copy');
    const iconShell = element('span', 'market-detail__icon');
    iconShell.setAttribute('aria-hidden', 'true');
    iconShell.append(createMarketCategoryIcon(category.id));
    const content = element('div');
    const compatibilityLabel = translateElement(element('span'), category.labelKey);
    compatibilityLabel.id = 'market-detail-title';
    compatibilityLabel.hidden = true;
    content.append(
      compatibilityLabel,
      translateElement(element('p', 'section-index'), 'markets.selectedCategory'),
      translateElement(element('h3'), category.titleKey),
      translateElement(element('p'), category.descriptionKey)
    );
    const instrumentList = element('div', 'market-instruments');
    instrumentList.setAttribute('role', 'group');
    translateElement(instrumentList, 'markets.instrumentsAria', 'aria-label');
    category.instruments.forEach((candidate) => {
      const selected = candidate.id === instrument.id;
      const button = element('button', selected ? 'is-selected' : '');
      button.type = 'button';
      button.dataset.instrumentId = candidate.id;
      button.setAttribute('aria-pressed', String(selected));
      const label = candidate.nameKey ? `${t(candidate.nameKey)} · ${candidate.symbol}` : candidate.symbol;
      button.textContent = label;
      button.dir = candidate.nameKey ? 'auto' : 'ltr';
      button.addEventListener('click', () => {
        selections[category.id] = candidate.id;
        render({ focusInstrument: true });
      });
      instrumentList.append(button);
    });
    content.append(instrumentList);
    copy.append(iconShell, content);

    const preview = element('div', 'market-detail__preview');
    const toolbar = element('div', 'market-detail__toolbar');
    const eyebrow = element('b', '', category.eyebrow);
    eyebrow.dir = 'ltr';
    toolbar.append(translateElement(element('span'), 'markets.demo'), eyebrow);
    const visual = element('div', 'market-detail__visual');
    visual.setAttribute('role', 'img');
    translateElement(visual, `markets.${category.id}.visualAria`, 'aria-label');
    visual.append(renderVisualization(category, instrument));
    const settings = element('div', 'market-detail__settings');
    const context = element('span');
    context.append(translateElement(element('small'), 'markets.context'), translateElement(element('b'), 'markets.userReview'));
    const signal = element('span');
    signal.append(translateElement(element('small'), 'markets.signal'), translateElement(element('b'), 'markets.bySettings'));
    settings.append(context, signal);
    preview.append(toolbar, visual, settings);
    const disclaimer = translateElement(element('p', 'market-detail__notice'), 'markets.disclaimer');
    panel.append(copy, preview, disclaimer);
    container.append(tablist, panel);

    if (focusTab) container.querySelector(`[data-category-id="${category.id}"]`)?.focus();
    if (focusInstrument) container.querySelector(`[data-instrument-id="${instrument.id}"]`)?.focus();
  };

  render();
  const unsubscribe = subscribeLanguage(() => render());
  return unsubscribe;
}
