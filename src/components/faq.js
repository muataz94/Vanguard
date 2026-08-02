import { trackEvent } from '../analytics.js';
import { t, translateElement } from '../i18n.js';

export function renderFaq(container, items) {
  container.replaceChildren();
  const entries = [];

  const setOpen = ({ button, panel, icon }, open, animate = true) => {
    button.setAttribute('aria-expanded', String(open));
    icon.textContent = open ? '−' : '+';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panel.getAnimations().forEach((animation) => animation.cancel());

    if (open) {
      panel.hidden = false;
      if (animate && !reduced && panel.animate) {
        panel.animate(
          [{ height: '0px', opacity: 0 }, { height: `${panel.scrollHeight}px`, opacity: 1 }],
          { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' }
        );
      }
      return;
    }

    if (!animate || reduced || !panel.animate) {
      panel.hidden = true;
      return;
    }
    panel.animate(
      [{ height: `${panel.scrollHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
      { duration: 180, easing: 'ease-in' }
    ).finished.then(() => { panel.hidden = true; }).catch(() => {});
  };

  items.forEach(([questionKey, answerKey], index) => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    const button = document.createElement('button');
    button.className = 'faq-question';
    button.type = 'button';
    button.id = `faq-question-${index}`;
    button.setAttribute('aria-expanded', String(index === 0));
    button.setAttribute('aria-controls', `faq-answer-${index}`);
    const label = document.createElement('span');
    translateElement(label, questionKey);
    const icon = document.createElement('span');
    icon.className = 'faq-symbol';
    icon.textContent = index === 0 ? '−' : '+';
    icon.setAttribute('aria-hidden', 'true');
    button.append(label, icon);
    const panel = document.createElement('div');
    panel.className = 'faq-answer';
    panel.id = `faq-answer-${index}`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', button.id);
    panel.hidden = index !== 0;
    const copy = document.createElement('p');
    translateElement(copy, answerKey);
    panel.append(copy);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.focus({ preventScroll: true });
      if (!open) {
        entries.filter((entry) => entry.button !== button).forEach((entry) => setOpen(entry, false, false));
        trackEvent('faq_open', { source_section: 'faq' });
      }
      setOpen({ button, panel, icon }, !open);
    });
    item.append(button, panel);
    container.append(item);
    entries.push({ button, panel, icon });
  });
}
