import { trackEvent } from '../analytics.js';

export function renderFaq(container, items) {
  items.forEach(([question, answer], index) => {
    const item = document.createElement('div');
    item.className = 'faq-item reveal';
    const button = document.createElement('button');
    button.className = 'faq-question';
    button.type = 'button';
    button.id = `faq-question-${index}`;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `faq-answer-${index}`);
    const label = document.createElement('span');
    label.textContent = question;
    const icon = document.createElement('span');
    icon.className = 'faq-symbol';
    icon.textContent = '+';
    icon.setAttribute('aria-hidden', 'true');
    button.append(label, icon);
    const panel = document.createElement('div');
    panel.className = 'faq-answer';
    panel.id = `faq-answer-${index}`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', button.id);
    panel.hidden = true;
    const copy = document.createElement('p');
    copy.textContent = answer;
    panel.append(copy);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      icon.textContent = open ? '+' : '−';
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (open) {
        if (reduced || !panel.animate) panel.hidden = true;
        else panel.animate(
          [{ height: `${panel.scrollHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
          { duration: 190, easing: 'ease-in' }
        ).finished.then(() => { panel.hidden = true; panel.style.height = ''; });
      } else {
        panel.hidden = false;
        if (!reduced && panel.animate) panel.animate(
          [{ height: '0px', opacity: 0 }, { height: `${panel.scrollHeight}px`, opacity: 1 }],
          { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' }
        );
        trackEvent('faq_open', { source_section: 'faq' });
      }
    });
    item.append(button, panel);
    container.append(item);
  });
}
