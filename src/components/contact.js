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
  return `مرحباً، أرغب بالاشتراك في ${siteConfig.brand.nameAr}.\n\nالباقة: ${plan.labelAr}\nالمدة: ${plan.months} ${plan.months === 1 ? 'شهر' : 'أشهر'}\nالسعر: ${plan.priceUsd} دولار\n\nيرجى تزويدي بتفاصيل الدفع والتفعيل.`;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function copyText(value, status) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value)
      .then(() => { status.textContent = 'تم نسخ البريد الإلكتروني.'; })
      .catch(() => { status.textContent = 'تعذر النسخ. حدّد البريد وانسخه يدوياً.'; });
    return;
  }
  status.textContent = 'حدّد البريد الإلكتروني وانسخه يدوياً.';
}

export function ensureContactDialog() {
  const existing = document.querySelector('#contact-dialog');
  if (existing) return existing;

  const dialog = element('dialog', 'contact-dialog');
  dialog.id = 'contact-dialog';
  dialog.setAttribute('aria-labelledby', 'contact-dialog-title');
  const shell = element('div', 'contact-dialog__shell');
  const accent = element('span', 'contact-dialog__accent');
  accent.setAttribute('aria-hidden', 'true');
  const close = element('button', 'contact-dialog__close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'إغلاق نافذة التواصل');
  const eyebrow = element('p', 'section-index', 'تواصل مباشر');
  const title = element('h2', '', 'كيف تفضّل التواصل؟');
  title.id = 'contact-dialog-title';
  const copy = element('p', 'contact-dialog__copy', 'اختر القناة المناسبة. لن يطلب منك الموقع أي بيانات دفع أو معلومات مالية.');
  const selection = element('p', 'contact-dialog__selection');
  selection.hidden = true;
  const actions = element('div', 'contact-dialog__actions');
  const email = element('a', 'button button--primary', 'إرسال بريد إلكتروني');
  email.dataset.contactEmail = '';
  const copyEmail = element('button', 'button button--secondary', 'نسخ البريد');
  copyEmail.type = 'button';
  const status = element('p', 'contact-dialog__status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const note = element('p', 'contact-dialog__note');
  const emailIsPlaceholder = /example\.com$/i.test(siteConfig.contact.email);
  note.textContent = emailIsPlaceholder
    ? 'تنبيه للمالك: البريد ورقم واتساب ما زالا بيانات تجريبية. أضف بيانات العمل الحقيقية في ملف الإعدادات.'
    : 'يمكنك أيضاً العودة واختيار إحدى الباقات لإرسال تفاصيلها تلقائياً.';

  close.addEventListener('click', () => dialog.close());
  copyEmail.addEventListener('click', () => copyText(siteConfig.contact.email, status));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  actions.append(email, copyEmail);
  shell.append(accent, close, eyebrow, title, copy, selection, actions, status, note);
  dialog.append(shell);
  document.body.append(dialog);
  return dialog;
}

function openContactFallback({ message = siteConfig.contact.defaultMessage, sourceSection, planId } = {}) {
  const dialog = ensureContactDialog();
  const selection = dialog.querySelector('.contact-dialog__selection');
  const email = dialog.querySelector('[data-contact-email]');
  const subject = planId ? `طلب باقة ${siteConfig.brand.nameAr}` : `استفسار عن ${siteConfig.brand.nameAr}`;
  email.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  selection.textContent = planId ? message : '';
  selection.hidden = !planId;
  dialog.querySelector('.contact-dialog__status').textContent = '';
  if (!dialog.open) dialog.showModal();
  trackEvent('cta_click', { source_section: sourceSection, plan_id: planId });
}

export function configureContactLink(link, { message, sourceSection, planId } = {}) {
  const url = createWhatsAppUrl(message);
  if (!url) {
    link.removeAttribute('aria-disabled');
    link.setAttribute('href', '#contact-dialog');
    link.removeAttribute('tabindex');
    link.title = 'فتح خيارات التواصل';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openContactFallback({ message, sourceSection, planId });
    });
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
  ensureContactDialog();
  document.querySelectorAll('[data-whatsapp]').forEach((link) => configureContactLink(link, {
    sourceSection: link.dataset.source
  }));
}
