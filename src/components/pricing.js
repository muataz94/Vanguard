import { siteConfig } from '../config.js';
import { configureContactLink } from './contact.js';
import { trackEvent } from '../analytics.js';
import { translateElement } from '../i18n.js';

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function renderPricing(container) {
  container.replaceChildren();

  siteConfig.pricing.forEach((plan) => {
    const card = createElement('article', `price-card${plan.id === 'annual' ? ' price-card--featured' : ''}`);
    card.dataset.plan = plan.id;
    card.append(translateElement(createElement('p', 'eyebrow'), plan.enabled ? 'pricing.available' : 'pricing.unavailable'));
    card.append(translateElement(createElement('h3'), `pricing.plan.${plan.id}`));
    const price = createElement('p', 'price');
    const amount = createElement('strong', '', `$${plan.priceUsd}`);
    amount.dir = 'ltr';
    price.append(amount, translateElement(createElement('span'), 'pricing.total'));
    card.append(price);

    const list = createElement('ul', 'check-list');
    ['pricing.feature.1', 'pricing.feature.2', 'pricing.feature.3', 'pricing.feature.4'].forEach((featureKey) => {
      const item = createElement('li');
      const icon = createElement('i');
      icon.dataset.lucide = 'check';
      icon.setAttribute('aria-hidden', 'true');
      item.append(icon, translateElement(createElement('span'), featureKey));
      list.append(item);
    });
    card.append(list);

    const action = translateElement(createElement(plan.enabled ? 'a' : 'button', 'button button--primary price-action'), plan.enabled ? 'pricing.action' : 'pricing.unavailable');
    if (plan.enabled) {
      configureContactLink(action, { sourceSection: 'pricing', planId: plan.id });
      action.addEventListener('click', () => trackEvent('pricing_plan_click', { plan_id: plan.id, source_section: 'pricing' }));
    } else {
      action.disabled = true;
      action.setAttribute('aria-disabled', 'true');
    }
    card.append(action);
    container.append(card);
  });
}
