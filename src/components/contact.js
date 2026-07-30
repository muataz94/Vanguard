import { siteConfig } from '../config.js';
import { trackEvent } from '../analytics.js';

export function isWhatsAppConfigured() {
  return typeof siteConfig.contact.whatsappNumber === 'string'
    && /^\d{10,15}$/.test(siteConfig.contact.whatsappNumber);
}

export function createWhatsAppUrl(message = siteConfig.contact.defaultMessage) {
  if (!isWhatsAppConfigured()) return null;
  const safeMessage = typeof message === 'string' && message.length <= 1200
    ? message
    : siteConfig.contact.defaultMessage;
  const url = new URL(`https://wa.me/${siteConfig.contact.whatsappNumber}`);
  url.searchParams.set('text', safeMessage);
  return url.toString();
}

export function buildPlanMessage(plan) {
  const configuredPlan = siteConfig.pricing.find((candidate) => candidate.id === plan?.id);
  if (!configuredPlan) return siteConfig.contact.defaultMessage;
  return `مرحباً، أرغب بالاشتراك في ${siteConfig.brand.nameAr}.\n\nالباقة: ${configuredPlan.labelAr}\nالمدة: ${configuredPlan.months} ${configuredPlan.months === 1 ? 'شهر' : 'أشهر'}\nالسعر: ${configuredPlan.priceUsd} دولار\n\nيرجى تزويدي بتفاصيل الدفع والتفعيل.`;
}

export function getConfiguredEmail() {
  const email = typeof siteConfig.contact.email === 'string' ? siteConfig.contact.email.trim() : '';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /example\.com$/i.test(email)) return null;
  return email;
}

export function getContactDestination(message = siteConfig.contact.defaultMessage) {
  const whatsappUrl = createWhatsAppUrl(message);
  if (whatsappUrl) return { kind: 'whatsapp', url: whatsappUrl };
  const email = getConfiguredEmail();
  if (email) return { kind: 'email', email };
  return { kind: 'disabled' };
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
  const configuredEmail = getConfiguredEmail();
  note.textContent = configuredEmail
    ? 'يمكنك أيضًا العودة واختيار إحدى الباقات لإرسال تفاصيلها تلقائيًا.'
    : 'استخدم قناة التواصل الرسمية الظاهرة في الصفحة للاستفسار عن التفعيل.';

  close.addEventListener('click', () => dialog.close());
  copyEmail.addEventListener('click', () => copyText(configuredEmail, status));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  if (configuredEmail) actions.append(email, copyEmail);
  shell.append(accent, close, eyebrow, title, copy, selection, actions, status, note);
  dialog.append(shell);
  document.body.append(dialog);
  return dialog;
}

function openContactFallback({ message = siteConfig.contact.defaultMessage, sourceSection, planId } = {}) {
  const configuredEmail = getConfiguredEmail();
  if (!configuredEmail) return;
  const dialog = ensureContactDialog();
  const selection = dialog.querySelector('.contact-dialog__selection');
  const email = dialog.querySelector('[data-contact-email]');
  const subject = planId ? `طلب باقة ${siteConfig.brand.nameAr}` : `استفسار عن ${siteConfig.brand.nameAr}`;
  const mailUrl = new URL(`mailto:${configuredEmail}`);
  mailUrl.searchParams.set('subject', subject);
  mailUrl.searchParams.set('body', message);
  email.href = mailUrl.toString();
  selection.textContent = planId ? message : '';
  selection.hidden = !planId;
  dialog.querySelector('.contact-dialog__status').textContent = '';
  if (!dialog.open) dialog.showModal();
  trackEvent('cta_click', { source_section: sourceSection, plan_id: planId });
}

export function configureContactLink(link, { message, sourceSection, planId } = {}) {
  const destination = getContactDestination(message);
  if (destination.kind !== 'whatsapp') {
    link.removeAttribute('target');
    link.removeAttribute('rel');
    if (destination.kind === 'email') {
      link.removeAttribute('aria-disabled');
      link.setAttribute('href', '#contact-dialog');
      link.removeAttribute('tabindex');
      link.title = 'فتح خيارات التواصل';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openContactFallback({ message, sourceSection, planId });
      });
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
      link.title = 'قناة التواصل غير متاحة مؤقتًا';
    }
    return;
  }
  link.href = destination.url;
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
