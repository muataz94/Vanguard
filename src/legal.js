import './styles.css';
import './legal.css';
import { siteConfig, validateConfig } from './config.js';
import { configureContactLink } from './components/contact.js';

document.querySelectorAll('[data-brand-name]').forEach((node) => { node.textContent = siteConfig.brand.nameAr; });
document.querySelectorAll('[data-business-name]').forEach((node) => { node.textContent = siteConfig.business.legalName; });
document.querySelectorAll('[data-business-address]').forEach((node) => { node.textContent = siteConfig.business.physicalAddress; });
document.querySelectorAll('[data-email]').forEach((node) => {
  node.textContent = siteConfig.contact.email;
  if (node.tagName === 'A') node.href = `mailto:${siteConfig.contact.email}`;
});
document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
document.querySelectorAll('[data-whatsapp]').forEach((link) => configureContactLink(link, { sourceSection: 'legal_page' }));
validateConfig().forEach((warning) => console.warn(`[Vanguard config] ${warning}`));
