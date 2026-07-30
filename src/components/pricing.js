import { siteConfig } from '../config.js';
import { buildPlanMessage, configureContactLink } from './contact.js';
import { trackEvent } from '../analytics.js';

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
    card.append(createElement('p', 'eyebrow', plan.enabled ? 'متاح للتفعيل اليدوي' : 'غير متاح حالياً'));
    card.append(createElement('h3', '', plan.labelAr));
    const price = createElement('p', 'price');
    const amount = createElement('strong', '', `$${plan.priceUsd}`);
    amount.dir = 'ltr';
    price.append(amount, createElement('span', '', 'إجمالي الباقة بالدولار الأمريكي'));
    card.append(price);

    const list = createElement('ul', 'check-list');
    ['المؤشر الرئيسي', 'مؤشرا Smart Money والتأكيد', 'إرشادات الإعداد والتفعيل', 'قناة دعم'].forEach((feature) => {
      const item = createElement('li');
      const icon = createElement('i');
      icon.dataset.lucide = 'check';
      icon.setAttribute('aria-hidden', 'true');
      item.append(icon, createElement('span', '', feature));
      list.append(item);
    });
    card.append(list);

    const action = createElement(plan.enabled ? 'a' : 'button', 'button button--primary price-action', plan.enabled ? 'اطلب تفاصيل التفعيل' : 'غير متاح حالياً');
    if (plan.enabled) {
      configureContactLink(action, { message: buildPlanMessage(plan), sourceSection: 'pricing', planId: plan.id });
      action.addEventListener('click', () => trackEvent('pricing_plan_click', { plan_id: plan.id, source_section: 'pricing' }));
    } else {
      action.disabled = true;
      action.setAttribute('aria-disabled', 'true');
    }
    card.append(action);
    container.append(card);
  });
}
