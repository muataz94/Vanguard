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
      panel.hidden = open;
      if (!open) trackEvent('faq_open', { source_section: 'faq' });
    });
    item.append(button, panel);
    container.append(item);
  });
}
