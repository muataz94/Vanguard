import './styles.css';
import { createIcons, ArrowLeft, BellRing, Bitcoin, ChartNoAxesCombined, ChartSpline, Check, ChevronUp, Landmark, Moon, Play, ScanLine, ShieldCheck, Smartphone, Sun, TimerReset, BetweenHorizontalStart } from 'lucide';
import { siteConfig, validateConfig } from './config.js';
import { benefits, faqs, workflow } from './content.js';
import { initAnalytics, trackEvent } from './analytics.js';
import { renderPricing } from './components/pricing.js';
import { renderFaq } from './components/faq.js';
import { renderEvidence } from './components/evidence.js';
import { initContactLinks, isWhatsAppConfigured } from './components/contact.js';
import { initMobileCta } from './components/mobile-cta.js';
import { initThemeToggle } from './components/theme.js';
import { initVanguardChartDemo } from './components/vanguard-chart-demo.js';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createBenefitPreview(index) {
  const preview = element('div', `benefit-preview benefit-preview--${index + 1}`);
  preview.setAttribute('aria-hidden', 'true');

  if (index === 0) {
    preview.append(...[0, 1, 2].map((line) => {
      return element('span', `preview-line preview-line--${line + 1}`);
    }));
  } else if (index === 1) {
    preview.append(element('span', 'preview-zone', 'منطقة متابعة'), element('span', 'preview-zone', 'نقطة إلغاء'));
  } else if (index === 2) {
    preview.append(element('span', 'preview-toggle', 'TradingView'), element('span', 'preview-toggle', 'تنبيه الهاتف'));
  } else if (index === 3) {
    siteConfig.markets.forEach((market) => preview.append(element('span', 'preview-pill', market)));
  } else if (index === 4) {
    preview.append(element('span', 'preview-clock', '09:00 — 22:00'), element('span', 'preview-days', 'أحد  اثنين  ثلاثاء  أربعاء  خميس'));
  } else {
    const phone = element('span', 'preview-phone');
    phone.append(element('i'), element('i'), element('i'));
    preview.append(phone);
  }

  return preview;
}

function renderContent() {
  const workflowList = document.querySelector('#workflow-list');
  workflow.forEach(([number, title, copy]) => {
    const item = document.createElement('li');
    item.className = 'workflow-item';
    const numberNode = element('span', '', number);
    const content = element('div');
    content.append(element('h3', '', title), element('p', '', copy));
    const preview = element('div', 'workflow-item__preview');
    preview.setAttribute('aria-hidden', 'true');
    preview.append(element('i'), element('i'), element('i'));
    content.append(preview);
    item.append(numberNode, content);
    workflowList.append(item);
  });

  const benefitsGrid = document.querySelector('#benefits-grid');
  benefits.forEach(([icon, title, copy], index) => {
    const card = document.createElement('article');
    card.className = 'benefit-card';
    const top = element('div', 'benefit-top');
    const iconNode = element('i');
    iconNode.dataset.lucide = icon;
    iconNode.setAttribute('aria-hidden', 'true');
    top.append(iconNode, element('span', '', `0${index + 1}`));
    card.append(top, element('h3', '', title), element('p', '', copy), createBenefitPreview(index));
    benefitsGrid.append(card);
  });

  const marketIcons = ['landmark', 'bitcoin', 'chart-no-axes-combined', 'chart-spline'];
  const marketDescriptions = [
    'يمكن تنظيم قراءة أزواج العملات ضمن إعدادات يحددها المستخدم. يجب التحقق من ملاءمة كل إعداد قبل استخدامه.',
    'تساعد الواجهة على ترتيب متابعة الأصول الرقمية المتقلبة، مع ضرورة استخدام إدارة مخاطر صارمة.',
    'يمكن مراجعة إشارات الأسهم ضمن ساعات السوق والسيولة المتاحة بعد اختبار الإعداد المناسب.',
    'تتيح البنية متابعة مؤشرات السوق بصريًا عبر أطر زمنية مختلفة وفق خطة المستخدم.'
  ];
  const marketLabels = ['FOREX / REVIEW', 'CRYPTO / REVIEW', 'STOCKS / REVIEW', 'INDICES / REVIEW'];
  const marketsList = document.querySelector('#markets-list');
  const marketDetail = document.querySelector('#market-detail');
  const previewLabel = document.querySelector('#market-preview-label');
  const marketButtons = [];
  const activateMarket = (item, index, focus = false) => {
    marketButtons.forEach((button) => {
      const active = button === item;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    document.querySelector('#market-detail-title').textContent = siteConfig.markets[index];
    document.querySelector('#market-detail-copy').textContent = marketDescriptions[index];
    previewLabel.textContent = marketLabels[index];
    marketDetail.setAttribute('aria-labelledby', item.id);
    marketDetail.dataset.market = String(index);
    if (focus) item.focus();
  };
  siteConfig.markets.forEach((market, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.id = `market-tab-${index}`;
    item.setAttribute('role', 'tab');
    item.setAttribute('aria-selected', String(index === 0));
    item.setAttribute('aria-controls', 'market-detail');
    item.tabIndex = index === 0 ? 0 : -1;
    item.classList.toggle('is-active', index === 0);
    const top = element('span');
    const iconNode = element('i');
    iconNode.dataset.lucide = marketIcons[index];
    iconNode.setAttribute('aria-hidden', 'true');
    top.append(iconNode, element('b', '', `0${index + 1}`));
    item.append(top, element('strong', '', market), element('small', '', 'عرض التفاصيل'));
    item.addEventListener('click', () => activateMarket(item, index));
    item.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = marketButtons.length - 1;
      else nextIndex = (index + (event.key === 'ArrowLeft' ? 1 : -1) + marketButtons.length) % marketButtons.length;
      activateMarket(marketButtons[nextIndex], nextIndex, true);
    });
    marketButtons.push(item);
    marketsList.append(item);
  });

  renderPricing(document.querySelector('#pricing-grid'));
  renderFaq(document.querySelector('#faq-list'), faqs);
  renderEvidence(document.querySelector('#evidence'), siteConfig.evidenceExamples);
  document.querySelector('#current-year').textContent = new Date().getFullYear();

  const contactNode = document.querySelector('#whatsapp-number');
  if (isWhatsAppConfigured()) {
    const contactDigits = siteConfig.contact.whatsappNumber;
    contactNode.textContent = contactDigits.length === 13
      ? `+${contactDigits.slice(0, 3)} ${contactDigits.slice(3, 6)} ${contactDigits.slice(6, 9)} ${contactDigits.slice(9)}`
      : `+${contactDigits}`;
  } else {
    contactNode.hidden = true;
  }

  createIcons({ icons: { ArrowLeft, BellRing, Bitcoin, ChartNoAxesCombined, ChartSpline, Check, ChevronUp, Landmark, Moon, Play, ScanLine, ShieldCheck, Smartphone, Sun, TimerReset, BetweenHorizontalStart } });
}

function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const backgroundRegions = [
    document.querySelector('main'),
    document.querySelector('footer'),
    document.querySelector('.whatsapp-float'),
    document.querySelector('.scroll-top'),
    document.querySelector('.mobile-action-bar')
  ].filter(Boolean);
  const focusables = () => [...nav.querySelectorAll('a[href]')];
  const setBackgroundInert = (inert) => backgroundRegions.forEach((region) => { region.inert = inert; });
  const closeMenu = (restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'فتح قائمة التنقل');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    setBackgroundInert(false);
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) closeMenu();
    else {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'إغلاق قائمة التنقل');
      nav.classList.add('is-open');
      document.body.classList.add('menu-open');
      setBackgroundInert(true);
      focusables()[0]?.focus();
    }
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (event) => {
    if (!nav.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key !== 'Tab') return;
    const items = [toggle, ...focusables()];
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const navLinks = [...nav.querySelectorAll('a[href^="#"]:not(.button)')];
  const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-24% 0px -68%', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

function initDemoWalkthrough() {
  const buttons = [...document.querySelectorAll('[data-demo-step]')];
  const copy = document.querySelector('#demo-step-copy');
  const terminal = document.querySelector('.abstract-stage');
  const status = terminal.querySelector('[data-demo-status]');
  const confirmation = terminal.querySelector('[data-demo-confirm]');
  const steps = {
    signal: ['تظهر منطقة المتابعة بصريًا لتبدأ منها المراجعة، لا لتنفذ الصفقة تلقائيًا.', 'منطقة متابعة', 'قيد المراجعة'],
    context: ['راجع اتجاه السوق والإطار الزمني ونقطة الإلغاء قبل تقييم الإشارة.', 'السياق مفتوح', 'يتطلب تحققًا'],
    alert: ['بعد ضبط شروطك في TradingView، يمكن أن يصلك التنبيه على الهاتف لتعود إلى الرسم.', 'تنبيه مضبوط', 'قرار المستخدم']
  };

  const activate = (button) => {
    buttons.forEach((candidate) => {
      const active = candidate === button;
      candidate.setAttribute('aria-selected', String(active));
      candidate.setAttribute('tabindex', active ? '0' : '-1');
    });
    const [message, state, confirm] = steps[button.dataset.demoStep];
    copy.textContent = message;
    copy.setAttribute('aria-labelledby', button.id);
    status.textContent = state;
    confirmation.textContent = confirm;
    terminal.dataset.mode = button.dataset.demoStep;
  };

  buttons.forEach((button, index) => {
    button.id = `demo-tab-${index}`;
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    button.addEventListener('click', () => {
      activate(button);
      trackEvent('video_play', { source_section: 'demo' });
    });
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = buttons.length - 1;
      else nextIndex = (index + (event.key === 'ArrowLeft' ? 1 : -1) + buttons.length) % buttons.length;
      const next = buttons[nextIndex];
      next.click();
      next.focus();
    });
  });
  copy.setAttribute('aria-labelledby', buttons[0].id);
}

function initScrollUi() {
  const header = document.querySelector('.site-header');
  const topButton = document.querySelector('.scroll-top');
  let queued = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
    topButton.classList.toggle('is-visible', window.scrollY > 700);
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { update(); queued = false; });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'auto' }));
  update();
}

async function startEnhancements() {
  try {
    const { initMotionSystem } = await import('./components/motion-system.js');
    await initMotionSystem();
  } catch (error) {
    if (import.meta.env.DEV) console.warn('تعذر تحميل الحركة؛ بقيت الصفحة الثابتة متاحة.', error);
  }
}

renderContent();
const cleanupTheme = initThemeToggle();
const cleanupChart = initVanguardChartDemo(document.querySelector('[data-vanguard-chart-demo]'));
initNavigation();
initContactLinks();
initMobileCta();
initDemoWalkthrough();
initScrollUi();
initAnalytics();
document.querySelectorAll('[data-track]').forEach((link) => link.addEventListener('click', () => trackEvent('cta_click', { source_section: link.dataset.track })));
if (import.meta.env.DEV) validateConfig().forEach((warning) => console.warn(`[Vanguard config] ${warning}`));

if (document.readyState === 'complete') startEnhancements();
else window.addEventListener('load', startEnhancements, { once: true });
window.addEventListener('pagehide', () => {
  cleanupTheme();
  cleanupChart();
}, { once: true });
