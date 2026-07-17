import { siteConfig } from '../config.js';
import { trackEvent } from '../analytics.js';

export function isWhatsAppConfigured() {
  return /^\d{10,15}$/.test(siteConfig.contact.whatsappNumber);
}

export function createWhatsAppUrl(message = siteConfig.contact.defaultMessage) {
  if (!isWhatsAppConfigured()) return null;
  const number = siteConfig.contact.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildPlanMessage(plan) {
  return `مرحباً، أرغب بالاشتراك في ${siteConfig.brand.nameAr}.\n\nالباقة: اشتراك ${plan.months} ${plan.months === 1 ? 'شهر' : 'أشهر'}\nالمدة: ${plan.months} ${plan.months === 1 ? 'شهر' : 'أشهر'}\nالسعر: ${plan.priceUsd} دولار\n\nيرجى تزويدي بتفاصيل الدفع والتفعيل.`;
}

export function configureContactLink(link, { message, sourceSection, planId } = {}) {
  const url = createWhatsAppUrl(message);
  if (!url) {
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('href', '/#footer-email');
    link.setAttribute('tabindex', '-1');
    link.title = 'أضف رقم واتساب الصحيح في ملف الإعدادات لتفعيل التواصل';
    link.addEventListener('click', (event) => event.preventDefault());
    return;
  }
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.addEventListener('click', () => trackEvent('whatsapp_click', {
    source_section: sourceSection,
    plan_id: planId
  }));
}

export function initContactLinks() {
  document.querySelectorAll('[data-whatsapp]').forEach((link) => configureContactLink(link, {
    sourceSection: link.dataset.source
  }));
}
