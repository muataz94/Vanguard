import { createIcons, Bitcoin, ChartNoAxesCombined, ChartSpline, Landmark } from 'lucide';
import { marketCategories } from '../data/market-categories.js';
import { subscribeLanguage, t, translateElement } from '../i18n.js';

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

function linePath(values, width = 420, height = 112) {
  const step = width / (values.length - 1);
  return values.map((value, index) => `${index ? 'L' : 'M'} ${Math.round(index * step)} ${Math.round((value / 72) * height)}`).join(' ');
}

function chartShell(className = '') {
  const svg = svgElement('svg', { viewBox: '0 0 420 112', preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false' });
  svg.classList.add('market-visual__svg');
  if (className) svg.classList.add(className);
  [28, 56, 84].forEach((y) => svg.append(svgElement('line', { x1: 0, y1: y, x2: 420, y2: y, class: 'market-grid-line' })));
  return svg;
}

function renderPaths(category, selectedId) {
  const wrapper = element('div', 'market-paths');
  const svg = chartShell();
  category.instruments.forEach((instrument) => {
    svg.append(svgElement('path', {
      d: linePath(instrument.values),
      class: `market-line${instrument.id === selectedId ? ' is-selected' : ''}`,
      'data-series': instrument.id,
      pathLength: 1
    }));
  });
  wrapper.append(svg);
  const legend = element('div', 'market-paths__legend');
  category.instruments.forEach((instrument) => {
    const item = element('span', instrument.id === selectedId ? 'is-selected' : '');
    item.dir = 'ltr';
    item.append(element('i'), document.createTextNode(instrument.symbol));
    legend.append(item);
  });
  wrapper.append(legend);
  return wrapper;
}

function renderCandles(instrument) {
  const svg = chartShell('market-candles');
  instrument.values.slice(0, 9).forEach((value, index) => {
    const next = instrument.values[index + 1];
    const x = 22 + index * 45;
    const top = Math.min(value, next);
    const height = Math.max(8, Math.abs(next - value));
    const rising = next < value;
    svg.append(svgElement('line', { x1: x + 8, y1: Math.max(5, top - 9), x2: x + 8, y2: Math.min(106, top + height + 10), class: rising ? 'candle-up' : 'candle-down' }));
    svg.append(svgElement('rect', { x, y: top, width: 16, height, rx: 2, class: rising ? 'candle-up' : 'candle-down' }));
  });
  return svg;
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

function renderOscillator(instrument) {
  const shell = element('div', 'market-oscillator');
  const svg = chartShell();
  svg.append(svgElement('rect', { x: 0, y: 8, width: 420, height: 18, class: 'market-zone' }));
  svg.append(svgElement('rect', { x: 0, y: 86, width: 420, height: 18, class: 'market-zone' }));
  svg.append(svgElement('path', { d: linePath(instrument.values), class: 'market-line is-selected', pathLength: 1 }));
  [2, 5, 8].forEach((index) => {
    const x = Math.round(index * (420 / (instrument.values.length - 1)));
    const y = Math.round((instrument.values[index] / 72) * 112);
    svg.append(svgElement('circle', { cx: x, cy: y, r: 5, class: 'market-signal-dot' }));
  });
  shell.append(svg);
  return shell;
}

function renderVisualization(category, instrument) {
  if (category.visualization === 'candles') return renderCandles(instrument);
  if (category.visualization === 'sparklines') return renderSparklines(category, instrument.id);
  if (category.visualization === 'oscillator') return renderOscillator(instrument);
  return renderPaths(category, instrument.id);
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
    const tabButtons = [];

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
      const icon = element('i');
      icon.dataset.lucide = candidate.icon;
      icon.setAttribute('aria-hidden', 'true');
      top.append(icon, element('b', '', `0${index + 1}`));
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
      tabButtons.push(button);
      tablist.append(button);
    });

    const panel = element('div', `market-detail market-detail--${category.accent}`);
    panel.id = 'market-detail';
    panel.dataset.category = category.id;
    panel.setAttribute('role', 'tabpanel');
    const categoryIndex = marketCategories.findIndex((candidate) => candidate.id === category.id);
    panel.setAttribute('aria-labelledby', `market-tab-${categoryIndex}`);
    panel.setAttribute('aria-live', 'polite');
    panel.tabIndex = 0;

    const copy = element('div', 'market-detail__copy');
    const iconShell = element('span', 'market-detail__icon');
    iconShell.setAttribute('aria-hidden', 'true');
    const icon = element('i');
    icon.dataset.lucide = category.icon;
    iconShell.append(icon);
    const content = element('div');
    const compatibilityLabel = translateElement(element('span'), category.labelKey);
    compatibilityLabel.id = 'market-detail-title';
    compatibilityLabel.hidden = true;
    content.append(
      compatibilityLabel,
      translateElement(element('p', 'section-index'), 'markets.selectedCategory'),
      translateElement(element('h3', '', undefined), category.titleKey),
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
    if (category.clarificationKey) content.append(translateElement(element('p', 'market-detail__clarification'), category.clarificationKey));
    copy.append(iconShell, content);

    const preview = element('div', 'market-detail__preview');
    translateElement(preview, 'markets.visualAria', 'aria-label');
    const toolbar = element('div', 'market-detail__toolbar');
    const eyebrow = element('b', '', category.eyebrow);
    eyebrow.dir = 'ltr';
    toolbar.append(translateElement(element('span'), 'markets.demo'), eyebrow);
    const visual = element('div', 'market-detail__visual');
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

    createIcons({ icons: { Bitcoin, ChartNoAxesCombined, ChartSpline, Landmark } });
    if (focusTab) container.querySelector(`[data-category-id="${category.id}"]`)?.focus();
    if (focusInstrument) container.querySelector(`[data-instrument-id="${instrument.id}"]`)?.focus();
  };

  render();
  const unsubscribe = subscribeLanguage(() => render());
  return unsubscribe;
}
