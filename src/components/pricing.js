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
  const enabledPlans = siteConfig.pricing.filter((plan) => plan.enabled);
  const bestMonthly = Math.min(...enabledPlans.map((plan) => plan.priceUsd / plan.months));

  siteConfig.pricing.forEach((plan) => {
    const monthly = plan.priceUsd / plan.months;
    const isBest = plan.enabled && Math.abs(monthly - bestMonthly) < 0.01;
    const card = createElement('article', `price-card${isBest ? ' price-card--best' : ''}`);
    card.dataset.plan = plan.id;
    if (isBest) card.append(createElement('span', 'price-badge', 'أفضل قيمة'));
    card.append(createElement('p', 'eyebrow', plan.enabled ? 'متاح للتفعيل اليدوي' : 'غير متاح حالياً'));
    card.append(createElement('h3', '', plan.labelAr));
    const price = createElement('p', 'price');
    price.append(createElement('strong', '', `$${plan.priceUsd}`), createElement('span', '', ' إجمالي الباقة'));
    card.append(price, createElement('p', 'monthly', `ما يعادل ${monthly.toFixed(2)} دولار شهرياً`));

    const list = createElement('ul', 'check-list');
    ['المؤشر الرئيسي', 'مؤشرا Smart Money والتأكيد', 'إرشادات الإعداد والتفعيل', 'قناة دعم'].forEach((feature) => {
      const item = createElement('li');
      item.innerHTML = `<i data-lucide="check" aria-hidden="true"></i><span>${feature}</span>`;
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
