import './styles.css';
import { createIcons, BellRing, ChartNoAxesCombined, ScanLine, Smartphone, TimerReset, BetweenHorizontalStart } from 'lucide';
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

  siteConfig.markets.forEach((market, index) => {
    const item = document.createElement('span');
    item.innerHTML = `<b>0${index + 1}</b>${market}<small>قيد التحقق</small>`;
    document.querySelector('#markets-list').append(item);
  });

  renderPricing(document.querySelector('#pricing-grid'));
  renderFaq(document.querySelector('#faq-list'), faqs);
  document.querySelector('#evidence').hidden = !siteConfig.product.showEvidence;
  document.querySelector('#testimonials').hidden = !siteConfig.product.showTestimonials;
  document.querySelector('#current-year').textContent = new Date().getFullYear();
  document.querySelector('#footer-email').textContent = siteConfig.contact.email;
  document.querySelector('#footer-email').href = `mailto:${siteConfig.contact.email}`;
  document.querySelector('#business-name').textContent = siteConfig.business.legalName;
  document.querySelector('#business-address').textContent = siteConfig.business.physicalAddress;
  createIcons({ icons: { BellRing, ChartNoAxesCombined, ScanLine, Smartphone, TimerReset, BetweenHorizontalStart } });
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
  const toast = document.querySelector('.video-toast');
  document.querySelectorAll('[data-video-play]').forEach((button) => button.addEventListener('click', () => {
    trackEvent('video_play', { source_section: 'demo' });
    toast.hidden = false;
    clearTimeout(window.vanguardToastTimer);
    window.vanguardToastTimer = window.setTimeout(() => { toast.hidden = true; }, 5000);
  }));
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
initAnalytics();
document.querySelectorAll('[data-track]').forEach((link) => link.addEventListener('click', () => trackEvent('cta_click', { source_section: link.dataset.track })));
validateConfig().forEach((warning) => console.warn(`[Vanguard config] ${warning}`));

if (document.readyState === 'complete') startEnhancements();
else window.addEventListener('load', startEnhancements, { once: true });
