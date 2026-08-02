import { siteConfig } from '../config.js';
import { trackEvent } from '../analytics.js';
import { getLanguage, subscribeLanguage, t, translateElement } from '../i18n.js';

const linkOptions = new WeakMap();
const initializedLinks = new WeakSet();

export function isWhatsAppConfigured() {
  return typeof siteConfig.contact.whatsappNumber === 'string'
    && /^\d{10,15}$/.test(siteConfig.contact.whatsappNumber);
}

export function createWhatsAppUrl(message = t('contact.defaultMessage')) {
  if (!isWhatsAppConfigured()) return null;
  const safeMessage = typeof message === 'string' && message.length <= 1200
    ? message
    : t('contact.defaultMessage');
  const url = new URL(`https://wa.me/${siteConfig.contact.whatsappNumber}`);
  url.searchParams.set('text', safeMessage);
  return url.toString();
}

export function buildPlanMessage(plan) {
  const configuredPlan = siteConfig.pricing.find((candidate) => candidate.id === plan?.id);
  if (!configuredPlan) return t('contact.defaultMessage');
  const planLabel = t(`pricing.plan.${configuredPlan.id}`);
  if (getLanguage() === 'en') {
    return `Hello, I would like to subscribe to ${siteConfig.brand.nameEn}.\n\nPlan: ${planLabel}\nDuration: ${configuredPlan.months} ${configuredPlan.months === 1 ? 'month' : 'months'}\nPrice: $${configuredPlan.priceUsd}\n\nPlease send me the payment and activation details.`;
  }
  return `مرحباً، أرغب بالاشتراك في ${siteConfig.brand.nameAr}.\n\nالباقة: ${planLabel}\nالمدة: ${configuredPlan.months} ${configuredPlan.months === 1 ? 'شهر' : 'أشهر'}\nالسعر: ${configuredPlan.priceUsd} دولار\n\nيرجى تزويدي بتفاصيل الدفع والتفعيل.`;
}

export function getConfiguredEmail() {
  const email = typeof siteConfig.contact.email === 'string' ? siteConfig.contact.email.trim() : '';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /example\.com$/i.test(email)) return null;
  return email;
}

export function getContactDestination(message = t('contact.defaultMessage')) {
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
      .then(() => { status.textContent = t('contact.copied'); })
      .catch(() => { status.textContent = t('contact.copyFailed'); });
    return;
  }
  status.textContent = t('contact.copyManual');
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
  translateElement(close, 'contact.dialogClose', 'aria-label');
  const eyebrow = translateElement(element('p', 'section-index'), 'contact.eyebrow');
  const title = translateElement(element('h2'), 'contact.title');
  title.id = 'contact-dialog-title';
  const copy = translateElement(element('p', 'contact-dialog__copy'), 'contact.copy');
  const selection = element('p', 'contact-dialog__selection');
  selection.hidden = true;
  const actions = element('div', 'contact-dialog__actions');
  const email = translateElement(element('a', 'button button--primary'), 'contact.email');
  email.dataset.contactEmail = '';
  const copyEmail = translateElement(element('button', 'button button--secondary'), 'contact.copyEmail');
  copyEmail.type = 'button';
  const status = element('p', 'contact-dialog__status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const note = element('p', 'contact-dialog__note');
  const configuredEmail = getConfiguredEmail();
  translateElement(note, configuredEmail ? 'contact.noteEmail' : 'contact.noteNoEmail');

  close.addEventListener('click', () => dialog.close());
  copyEmail.addEventListener('click', () => copyText(configuredEmail, status));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  if (configuredEmail) actions.append(email, copyEmail);
  shell.append(accent, close, eyebrow, title, copy, selection, actions, status, note);
  dialog.append(shell);
  document.body.append(dialog);
  return dialog;
}

function openContactFallback({ message = t('contact.defaultMessage'), sourceSection, planId } = {}) {
  const configuredEmail = getConfiguredEmail();
  if (!configuredEmail) return;
  const dialog = ensureContactDialog();
  const selection = dialog.querySelector('.contact-dialog__selection');
  const email = dialog.querySelector('[data-contact-email]');
  const subject = getLanguage() === 'en'
    ? (planId ? `Vanguard Indicator plan request` : `Vanguard Indicator enquiry`)
    : (planId ? `طلب باقة ${siteConfig.brand.nameAr}` : `استفسار عن ${siteConfig.brand.nameAr}`);
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

function resolveMessage(options = {}) {
  if (options.planId) return buildPlanMessage({ id: options.planId });
  return options.message || t('contact.defaultMessage');
}

function updateContactLink(link) {
  const options = linkOptions.get(link) || {};
  const destination = getContactDestination(resolveMessage(options));
  if (destination.kind !== 'whatsapp') {
    link.removeAttribute('target');
    link.removeAttribute('rel');
    if (destination.kind === 'email') {
      link.removeAttribute('aria-disabled');
      link.setAttribute('href', '#contact-dialog');
      link.removeAttribute('tabindex');
      link.title = t('contact.openOptions');
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
      link.title = t('contact.unavailable');
    }
    return;
  }
  link.href = destination.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.removeAttribute('aria-disabled');
  link.removeAttribute('tabindex');
  link.removeAttribute('title');
}

export function configureContactLink(link, options = {}) {
  linkOptions.set(link, options);
  link.dataset.contactLink = '';
  if (!initializedLinks.has(link)) {
    link.addEventListener('click', (event) => {
      const current = linkOptions.get(link) || {};
      const destination = getContactDestination(resolveMessage(current));
      if (destination.kind === 'whatsapp') {
        trackEvent('whatsapp_click', { source_section: current.sourceSection, plan_id: current.planId });
        return;
      }
      event.preventDefault();
      if (destination.kind === 'email') openContactFallback({ message: resolveMessage(current), ...current });
    });
    initializedLinks.add(link);
  }
  updateContactLink(link);
}

export function initContactLinks() {
  ensureContactDialog();
  document.querySelectorAll('[data-whatsapp]').forEach((link) => configureContactLink(link, {
    sourceSection: link.dataset.source
  }));
  const refresh = () => document.querySelectorAll('[data-contact-link]').forEach(updateContactLink);
  return subscribeLanguage(refresh);
}
