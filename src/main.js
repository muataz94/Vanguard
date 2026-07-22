import './styles.css';
import { createIcons, ArrowLeft, BellRing, Bitcoin, ChartCandlestick, ChartNoAxesCombined, ChartSpline, Check, ChevronUp, Landmark, Play, ScanLine, Smartphone, TimerReset, BetweenHorizontalStart } from 'lucide';
import { siteConfig, validateConfig } from './config.js';
import { benefits, faqs, workflow } from './content.js';
import { initAnalytics, trackEvent } from './analytics.js';
import { renderPricing } from './components/pricing.js';
import { renderFaq } from './components/faq.js';
import { renderEvidence } from './components/evidence.js';
import { initContactLinks } from './components/contact.js';
import { initMobileCta } from './components/mobile-cta.js';

function renderContent() {
  const workflowList = document.querySelector('#workflow-list');
  workflow.forEach(([number, title, copy]) => {
    const item = document.createElement('li');
    item.className = 'workflow-item';
    item.innerHTML = `<span>${number}</span><div><h3>${title}</h3><p>${copy}</p></div>`;
    workflowList.append(item);
  });

  const benefitsGrid = document.querySelector('#benefits-grid');
  benefits.forEach(([icon, title, copy], index) => {
    const card = document.createElement('article');
    card.className = 'benefit-card';
    card.innerHTML = `<div class="benefit-top"><i data-lucide="${icon}" aria-hidden="true"></i><span>0${index + 1}</span></div><h3>${title}</h3><p>${copy}</p>`;
    benefitsGrid.append(card);
  });

  const marketIcons = ['landmark', 'bitcoin', 'chart-candlestick', 'chart-spline'];
  const marketDescriptions = [
    'يمكن تنظيم قراءة أزواج العملات ضمن إعدادات يحددها المستخدم. يجب التحقق من ملاءمة كل إعداد قبل استخدامه.',
    'تساعد الواجهة على ترتيب متابعة الأصول الرقمية المتقلبة، مع ضرورة استخدام إدارة مخاطر صارمة.',
    'يمكن مراجعة إشارات الأسهم ضمن ساعات السوق والسيولة المتاحة بعد اختبار الإعداد المناسب.',
    'تتيح البنية متابعة مؤشرات السوق بصريًا عبر أطر زمنية مختلفة وفق خطة المستخدم.'
  ];
  const marketsList = document.querySelector('#markets-list');
  siteConfig.markets.forEach((market, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.setAttribute('aria-pressed', String(index === 0));
    item.setAttribute('aria-controls', 'market-detail');
    item.classList.toggle('is-active', index === 0);
    item.innerHTML = `<span><i data-lucide="${marketIcons[index]}" aria-hidden="true"></i><b>0${index + 1}</b></span><strong>${market}</strong><small>عرض التفاصيل</small>`;
    item.addEventListener('click', () => {
      marketsList.querySelectorAll('button').forEach((button) => {
        const active = button === item;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      document.querySelector('#market-detail-title').textContent = market;
      document.querySelector('#market-detail-copy').textContent = marketDescriptions[index];
    });
    marketsList.append(item);
  });

  renderPricing(document.querySelector('#pricing-grid'));
  renderFaq(document.querySelector('#faq-list'), faqs);
  renderEvidence(document.querySelector('#evidence'), siteConfig.evidenceExamples);
  document.querySelector('#current-year').textContent = new Date().getFullYear();

  const contactDigits = siteConfig.contact.whatsappNumber.replace(/\D/g, '');
  document.querySelector('#whatsapp-number').textContent = contactDigits.length === 13
    ? `+${contactDigits.slice(0, 3)} ${contactDigits.slice(3, 6)} ${contactDigits.slice(6, 9)} ${contactDigits.slice(9)}`
    : `+${contactDigits}`;

  createIcons({ icons: { ArrowLeft, BellRing, Bitcoin, ChartCandlestick, ChartNoAxesCombined, ChartSpline, Check, ChevronUp, Landmark, Play, ScanLine, Smartphone, TimerReset, BetweenHorizontalStart } });
}

function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const focusables = () => [...nav.querySelectorAll('a[href]')];
  const closeMenu = (restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'فتح قائمة التنقل');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
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
      focusables()[0]?.focus();
    }
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
  const terminal = document.querySelector('.demo-terminal');
  const status = terminal.querySelector('[data-demo-status]');
  const confirmation = terminal.querySelector('[data-demo-confirm]');
  const steps = {
    signal: ['تظهر منطقة المتابعة بصريًا لتبدأ منها المراجعة، لا لتنفذ الصفقة تلقائيًا.', 'منطقة متابعة', 'قيد المراجعة'],
    context: ['راجع اتجاه السوق والإطار الزمني ونقطة الإلغاء قبل تقييم الإشارة.', 'السياق مفتوح', 'يتطلب تحققًا'],
    alert: ['بعد ضبط شروطك في TradingView، يمكن أن يصلك التنبيه على الهاتف لتعود إلى الرسم.', 'تنبيه مضبوط', 'قرار المستخدم']
  };

  const activate = (button) => {
    buttons.forEach((candidate) => candidate.setAttribute('aria-selected', String(candidate === button)));
    const [message, state, confirm] = steps[button.dataset.demoStep];
    copy.textContent = message;
    status.textContent = state;
    confirmation.textContent = confirm;
    terminal.dataset.mode = button.dataset.demoStep;
  };

  buttons.forEach((button, index) => {
    button.id = `demo-tab-${index}`;
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    button.addEventListener('click', () => {
      buttons.forEach((candidate) => candidate.setAttribute('tabindex', candidate === button ? '0' : '-1'));
      activate(button);
      trackEvent('video_play', { source_section: 'demo' });
    });
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? 1 : -1;
      const next = buttons[(index + direction + buttons.length) % buttons.length];
      next.click();
      next.focus();
    });
  });
}

function initScrollUi() {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const topButton = document.querySelector('.scroll-top');
  let queued = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    progress.style.transform = `scaleX(${ratio})`;
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
