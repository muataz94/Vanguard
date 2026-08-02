const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const revealSelector = '.split-heading, .chapter-heading, .activation-head, .faq-intro, .final-cta__panel';
const cardSelector = '.feature-card, .benefit-card, .workflow-item, .market-pills > button, .bundle-features article, .price-card, .activation-steps li, .faq-item';

function revealEverything() {
  document.documentElement.dataset.motionMode = 'static';
  document.querySelectorAll('.motion-reveal-target').forEach((target) => target.classList.add('is-revealed'));
}

function prepareTargets() {
  document.querySelectorAll(`${revealSelector}, ${cardSelector}, .hero-copy > *, .hero-chart, .abstract-stage, .bundle-console`)
    .forEach((target) => target.classList.add('motion-reveal-target'));
}

function createRevealTriggers(ScrollTrigger) {
  const triggers = [];
  document.querySelectorAll(`${revealSelector}, ${cardSelector}, .abstract-stage, .bundle-console`).forEach((target) => {
    const trigger = ScrollTrigger.create({
      trigger: target,
      start: 'top 90%',
      once: true,
      onEnter: () => target.classList.add('is-revealed')
    });
    triggers.push(trigger);
  });
  return triggers;
}

function revealHero() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero-copy > *, .hero-chart').forEach((target, index) => {
      window.setTimeout(() => target.classList.add('is-revealed'), index * 45);
    });
  });
}

export async function initMotionSystem() {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  const preference = window.matchMedia(reducedMotionQuery);
  let stopCurrent = () => {};

  const setup = async () => {
    stopCurrent();
    prepareTargets();
    if (preference.matches) {
      revealEverything();
      return;
    }

    document.documentElement.dataset.motionMode = 'enhanced';
    document.querySelectorAll('.motion-reveal-target').forEach((target) => target.classList.remove('is-revealed'));
    revealHero();
    const triggers = createRevealTriggers(ScrollTrigger);
    const stage = document.querySelector('#vanguard-abstract-stage');
    let stopAbstract = () => {};
    if (stage) {
      const { initAbstractVanguard } = await import('./abstract-vanguard.js');
      stopAbstract = initAbstractVanguard(stage) || (() => {});
    }

    if (document.fonts?.ready) await document.fonts.ready;
    requestAnimationFrame(() => ScrollTrigger.refresh());
    stopCurrent = () => {
      triggers.forEach((trigger) => trigger.kill(true));
      stopAbstract();
      revealEverything();
    };
  };

  await setup();
  const onChange = () => { setup(); };
  preference.addEventListener('change', onChange);
  const cleanup = () => {
    preference.removeEventListener('change', onChange);
    stopCurrent();
  };
  window.addEventListener('pagehide', cleanup, { once: true });
  return cleanup;
}
