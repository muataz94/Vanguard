import './styles.css';
import { createIcons, ArrowLeft, BellRing, Check, ChevronUp, ExternalLink, Moon, Play, ScanLine, ShieldCheck, Smartphone, Sun, TimerReset, BetweenHorizontalStart } from 'lucide';
import { siteConfig, validateConfig } from './config.js';
import { benefits, faqs, workflow } from './content.js';
import { initAnalytics, trackEvent } from './analytics.js';
import { renderPricing } from './components/pricing.js';
import { renderFaq } from './components/faq.js';
import { renderEvidence } from './components/evidence.js';
import { initContactLinks } from './components/contact.js';
import { initMobileCta } from './components/mobile-cta.js';
import { initThemeToggle } from './components/theme.js';
import { initTradingViewChart } from './components/tradingview-chart.js';
import { initLanguageSystem, subscribeLanguage, t, translateElement } from './i18n.js';
import { renderMarketExplorer } from './components/market-explorer.js';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function translatedElement(tag, className, key) {
  return translateElement(element(tag, className), key);
}

function createBenefitPreview(index) {
  const preview = element('div', `benefit-preview benefit-preview--${index + 1}`);
  preview.setAttribute('aria-hidden', 'true');

  if (index === 0) {
    preview.append(...[0, 1, 2].map((line) => {
      return element('span', `preview-line preview-line--${line + 1}`);
    }));
  } else if (index === 1) {
    preview.append(translatedElement('span', 'preview-zone', 'benefits.zone'), translatedElement('span', 'preview-zone', 'benefits.invalidation'));
  } else if (index === 2) {
    preview.append(element('span', 'preview-toggle', 'TradingView'), translatedElement('span', 'preview-toggle', 'benefits.mobileAlert'));
  } else if (index === 3) {
    ['forex', 'crypto', 'stocks', 'indicators'].forEach((market) => preview.append(translatedElement('span', 'preview-pill', `markets.${market}.label`)));
  } else if (index === 4) {
    preview.append(element('span', 'preview-clock', '09:00 — 22:00'), translatedElement('span', 'preview-days', 'benefits.days'));
  } else {
    const phone = element('span', 'preview-phone');
    phone.append(element('i'), element('i'), element('i'));
    preview.append(phone);
  }

  return preview;
}

function renderContent() {
  const workflowList = document.querySelector('#workflow-list');
  workflow.forEach(([number, titleKey, copyKey]) => {
    const item = document.createElement('li');
    item.className = 'workflow-item';
    const numberNode = element('span', '', number);
    const content = element('div');
    content.append(translatedElement('h3', '', titleKey), translatedElement('p', '', copyKey));
    const preview = element('div', 'workflow-item__preview');
    preview.setAttribute('aria-hidden', 'true');
    preview.append(element('i'), element('i'), element('i'));
    content.append(preview);
    item.append(numberNode, content);
    workflowList.append(item);
  });

  const benefitsGrid = document.querySelector('#benefits-grid');
  benefits.forEach(([icon, titleKey, copyKey], index) => {
    const card = document.createElement('article');
    card.className = 'benefit-card';
    const top = element('div', 'benefit-top');
    const iconNode = element('i');
    iconNode.dataset.lucide = icon;
    iconNode.setAttribute('aria-hidden', 'true');
    top.append(iconNode, element('span', '', `0${index + 1}`));
    card.append(top, translatedElement('h3', '', titleKey), translatedElement('p', '', copyKey), createBenefitPreview(index));
    benefitsGrid.append(card);
  });

  renderPricing(document.querySelector('#pricing-grid'));
  renderFaq(document.querySelector('#faq-list'), faqs);
  renderEvidence(document.querySelector('#evidence'), siteConfig.evidenceExamples);
  document.querySelector('#current-year').textContent = new Date().getFullYear();

  createIcons({ icons: { ArrowLeft, BellRing, Check, ChevronUp, ExternalLink, Moon, Play, ScanLine, ShieldCheck, Smartphone, Sun, TimerReset, BetweenHorizontalStart } });
}

function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const headerControls = [...document.querySelectorAll('.header-actions button')];
  const utilityControls = headerControls.filter((button) => button !== toggle);
  const backgroundRegions = [
    document.querySelector('main'),
    document.querySelector('footer'),
    document.querySelector('.whatsapp-float'),
    document.querySelector('.scroll-top'),
    document.querySelector('.mobile-action-bar')
  ].filter(Boolean);
  const navFocusables = () => [...nav.querySelectorAll('a[href]')];
  const focusables = () => [toggle, ...navFocusables(), ...utilityControls];
  const setBackgroundInert = (inert) => backgroundRegions.forEach((region) => { region.inert = inert; });
  const closeMenu = (restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', t('nav.menuOpen'));
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    setBackgroundInert(false);
    if (restoreFocus) toggle.focus();
  };

  const onToggle = () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) closeMenu();
    else {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', t('nav.menuClose'));
      nav.classList.add('is-open');
      document.body.classList.add('menu-open');
      setBackgroundInert(true);
      navFocusables()[0]?.focus();
    }
  };
  const desktopQuery = window.matchMedia('(min-width: 1000px)');
  const onDesktopChange = (event) => {
    if (event.matches) closeMenu();
  };
  const onNavClick = (event) => { if (event.target.closest('a')) closeMenu(); };
  const onKeydown = (event) => {
    if (!nav.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      closeMenu(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    const activeIndex = Math.max(0, items.indexOf(document.activeElement));
    const nextIndex = (activeIndex + (event.shiftKey ? -1 : 1) + items.length) % items.length;
    event.preventDefault();
    items[nextIndex].focus();
  };
  toggle.addEventListener('click', onToggle);
  desktopQuery.addEventListener('change', onDesktopChange);
  nav.addEventListener('click', onNavClick);
  document.addEventListener('keydown', onKeydown);

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
  const unsubscribe = subscribeLanguage(() => {
    toggle.setAttribute('aria-label', t(toggle.getAttribute('aria-expanded') === 'true' ? 'nav.menuClose' : 'nav.menuOpen'));
  });
  return () => {
    closeMenu();
    toggle.removeEventListener('click', onToggle);
    desktopQuery.removeEventListener('change', onDesktopChange);
    nav.removeEventListener('click', onNavClick);
    document.removeEventListener('keydown', onKeydown);
    observer.disconnect();
    unsubscribe();
  };
}

function initDemoWalkthrough() {
  const buttons = [...document.querySelectorAll('[data-demo-step]')];
  const copy = document.querySelector('#demo-step-copy');
  const steps = { signal: 'demo.signalCopy', context: 'demo.contextCopy', alert: 'demo.alertCopy' };

  const activate = (button) => {
    buttons.forEach((candidate) => {
      const active = candidate === button;
      candidate.setAttribute('aria-selected', String(active));
      candidate.setAttribute('tabindex', active ? '0' : '-1');
    });
    translateElement(copy, steps[button.dataset.demoStep]);
    copy.setAttribute('aria-labelledby', button.id);
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
  return subscribeLanguage(() => translateElement(copy, steps[document.querySelector('[data-demo-step][aria-selected="true"]')?.dataset.demoStep || 'signal']));
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
const cleanupLanguage = initLanguageSystem();
const cleanupTheme = initThemeToggle();
const cleanupChart = initTradingViewChart(document.querySelector('[data-tradingview-chart]'));
const cleanupNavigation = initNavigation();
const cleanupContact = initContactLinks();
initMobileCta();
const cleanupDemo = initDemoWalkthrough();
const cleanupMarkets = renderMarketExplorer(document.querySelector('#market-explorer'));
initScrollUi();
initAnalytics();
document.querySelectorAll('[data-track]').forEach((link) => link.addEventListener('click', () => trackEvent('cta_click', { source_section: link.dataset.track })));
if (import.meta.env.DEV) validateConfig().forEach((warning) => console.warn(`[Vanguard config] ${warning}`));

if (document.readyState === 'complete') startEnhancements();
else window.addEventListener('load', startEnhancements, { once: true });
window.addEventListener('pagehide', () => {
  cleanupTheme();
  cleanupChart();
  cleanupLanguage();
  cleanupNavigation();
  cleanupContact?.();
  cleanupDemo();
  cleanupMarkets();
}, { once: true });
