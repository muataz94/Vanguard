import { configureContactLink } from './contact.js';

export function initMobileCta() {
  const cta = document.querySelector('[data-mobile-contact]');
  if (cta) configureContactLink(cta, { sourceSection: 'mobile_bar' });
}
