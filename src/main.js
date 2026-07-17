import './styles.css';
import { createIcons, ArrowLeft, BellRing, Bitcoin, ChartCandlestick, ChartNoAxesCombined, ChartSpline, Check, ChevronUp, CircleAlert, Landmark, MessageCircle, Play, ScanLine, Smartphone, TimerReset, BetweenHorizontalStart } from 'lucide';
import { siteConfig, validateConfig } from './config.js';
import { benefits, faqs, workflow } from './content.js';
import { initAnalytics, trackEvent } from './analytics.js';
import { renderPricing } from './components/pricing.js';
import { renderFaq } from './components/faq.js';
import { initContactLinks } from './components/contact.js';
import { initMobileCta } from './components/mobile-cta.js';

function renderContent() {
  const workflowList = document.querySelector('#workflow-list');
  workflow.forEach(([number, title, copy]) => {
    const item = document.createElement('li');
    item.className = 'workflow-item reveal';
    item.innerHTML = `<span>${number}</span><div><h3>${title}</h3><p>${copy}</p></div>`;
    workflowList.append(item);
  });

  const benefitsGrid = document.querySelector('#benefits-grid');
  benefits.forEach(([icon, title, copy], index) => {
    const card = document.createElement('article');
    card.className = 'benefit-card reveal';
    card.innerHTML = `<div class="benefit-top"><i data-lucide="${icon}" aria-hidden="true"></i><span>0${index + 1}</span></div><h3>${title}</h3><p>${copy}</p>`;
    benefitsGrid.append(card);
  });

  const marketIcons = ['landmark', 'bitcoin', 'chart-candlestick', 'chart-spline'];
  const marketDescriptions = [
    'يمكن تنظيم قراءة أزواج العملات ضمن إعدادات يحددها المستخدم. يجب التحقق من ملاءمة كل إعداد قبل استخدامه.',
    'تساعد الواجهة على ترتيب متابعة الأصول الرقمية المتقلبة، مع ضرورة استخدام إدارة مخاطر صارمة.',
    'يمكن مراجعة إشارات الأسهم ضمن ساعات السوق والسيولة المتاحة، بعد تأكيد الإعدادات المدعومة.',
    'تتيح البنية متابعة مؤشرات السوق بصرياً عبر أطر زمنية مختلفة وفق خطة المستخدم.'
  ];
  siteConfig.markets.forEach((market, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.setAttribute('aria-pressed', String(index === 0));
    item.setAttribute('aria-controls', 'market-detail');
    item.classList.toggle('is-active', index === 0);
    item.innerHTML = `<span><i data-lucide="${marketIcons[index]}" aria-hidden="true"></i><b>0${index + 1}</b></span><strong>${market}</strong><small>عرض التفاصيل</small>`;
    item.addEventListener('click', () => {
      document.querySelectorAll('#markets-list button').forEach((button) => {
        const active = button === item;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      document.querySelector('#market-detail-title').textContent = market;
      document.querySelector('#market-detail-copy').textContent = marketDescriptions[index];
    });
    document.querySelector('#markets-list').append(item);
  });

  renderPricing(document.querySelector('#pricing-grid'));
  renderFaq(document.querySelector('#faq-list'), faqs);
  document.querySelector('#evidence').hidden = !siteConfig.product.showEvidence;
  document.querySelector('#testimonials').hidden = !siteConfig.product.showTestimonials;
  document.querySelector('#current-year').textContent = new Date().getFullYear();
  document.querySelector('#footer-email').textContent = siteConfig.contact.email;
  document.querySelector('#footer-email').href = `mailto:${siteConfig.contact.email}`;
  const contactDigits = siteConfig.contact.whatsappNumber.replace(/\D/g, '');
  document.querySelector('#whatsapp-number').textContent = contactDigits.length === 13
    ? `+${contactDigits.slice(0, 3)} ${contactDigits.slice(3, 6)} ${contactDigits.slice(6, 9)} ${contactDigits.slice(9)}`
    : `+${contactDigits}`;
  document.querySelector('#business-name').textContent = siteConfig.business.legalName;
  document.querySelector('#business-address').textContent = siteConfig.business.physicalAddress;
  createIcons({ icons: { ArrowLeft, BellRing, Bitcoin, ChartCandlestick, ChartNoAxesCombined, ChartSpline, Check, ChevronUp, CircleAlert, Landmark, MessageCircle, Play, ScanLine, Smartphone, TimerReset, BetweenHorizontalStart } });
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
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -65%', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

function initVideoPlaceholder() {
  const placeholder = document.querySelector('.video-placeholder');
  const explainer = document.querySelector('.video-explainer');
  const triggers = [...document.querySelectorAll('[data-video-play]')];
  const close = document.querySelector('.video-explainer__close');
  triggers.forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'video-explainer');
    button.addEventListener('click', () => {
      trackEvent('video_play', { source_section: 'demo' });
      explainer.hidden = false;
      placeholder.classList.add('is-explaining');
      triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'true'));
      close.focus();
    });
  });
  close.addEventListener('click', () => {
    explainer.hidden = true;
    placeholder.classList.remove('is-explaining');
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    triggers[0].focus();
  });
}

function initScrollTop() {
  const button = document.querySelector('.scroll-top');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const update = () => button.classList.toggle('is-visible', window.scrollY > 700);
  window.addEventListener('scroll', update, { passive: true });
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  update();
}

function initScrollUi() {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

async function startEnhancements() {
  try {
    const [{ initAnimations }, { initThreeScene }] = await Promise.all([
      import('./components/animations.js'),
      import('./components/three-scene.js')
    ]);
    await initAnimations();
    window.requestIdleCallback
      ? window.requestIdleCallback(() => initThreeScene(document.querySelector('#three-scene')), { timeout: 1200 })
      : window.setTimeout(() => initThreeScene(document.querySelector('#three-scene')), 400);
  } catch (error) {
    console.warn('تعذر تحميل التحسينات البصرية؛ ستبقى النسخة الثابتة متاحة.', error);
  }
}

renderContent();
initNavigation();
initContactLinks();
initMobileCta();
initVideoPlaceholder();
initScrollTop();
initScrollUi();
initAnalytics();
document.querySelectorAll('[data-track]').forEach((link) => link.addEventListener('click', () => trackEvent('cta_click', { source_section: link.dataset.track })));
validateConfig().forEach((warning) => console.warn(`[Vanguard config] ${warning}`));

if (document.readyState === 'complete') startEnhancements();
else window.addEventListener('load', startEnhancements, { once: true });
