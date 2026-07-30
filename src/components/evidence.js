import { siteConfig } from '../config.js';

export function renderEvidence(section, examples = []) {
  if (!section) return;
  const canShow = siteConfig.product.showEvidence && examples.length > 0;
  section.hidden = !canShow;
  if (!canShow) return;

  const grid = section.querySelector('#evidence-grid');
  grid.replaceChildren();
  examples.forEach(({ title, summary, image, alt }) => {
    const card = document.createElement('article');
    card.className = 'evidence-card';
    const visual = document.createElement('img');
    visual.src = image;
    visual.alt = alt;
    visual.loading = 'lazy';
    visual.width = 960;
    visual.height = 600;
    const heading = document.createElement('h3');
    heading.textContent = title;
    const copy = document.createElement('p');
    copy.textContent = summary;
    card.append(visual, heading, copy);
    grid.append(card);
  });
}
