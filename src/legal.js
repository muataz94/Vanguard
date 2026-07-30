import './styles.css';
import './legal.css';
import { siteConfig, validateConfig } from './config.js';
import { configureContactLink, getConfiguredEmail } from './components/contact.js';

document.querySelectorAll('[data-brand-name]').forEach((node) => { node.textContent = siteConfig.brand.nameAr; });
const neutralIdentity = 'تُزوَّد عبر قناة التواصل الرسمية';
document.querySelectorAll('[data-business-name]').forEach((node) => { node.textContent = siteConfig.business.legalName || neutralIdentity; });
document.querySelectorAll('[data-business-address]').forEach((node) => { node.textContent = siteConfig.business.physicalAddress || neutralIdentity; });
document.querySelectorAll('[data-email]').forEach((node) => {
  const configuredEmail = getConfiguredEmail();
  node.textContent = configuredEmail || 'قناة التواصل الرسمية';
  if (node.tagName === 'A' && configuredEmail) node.href = `mailto:${configuredEmail}`;
  else if (node.tagName === 'A') node.removeAttribute('href');
});
document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
document.querySelectorAll('[data-whatsapp]').forEach((link) => configureContactLink(link, { sourceSection: 'legal_page' }));
if (import.meta.env.DEV) validateConfig().forEach((warning) => console.warn(`[Vanguard config] ${warning}`));
