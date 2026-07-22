const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const revealSelector = '.split-heading, .chapter-heading, .activation-head, .faq-intro, .final-cta .container';
const cardSelector = '.feature-card, .benefit-card, .workflow-item, .market-pills > button, .bundle-features article, .price-card, .activation-steps li, .faq-item';

function clearMotion(gsap) {
  gsap.set(`${revealSelector}, ${cardSelector}, .hero-copy > *, .hero-visual, .abstract-stage`, { clearProps: 'all' });
  document.documentElement.dataset.motionMode = 'static';
}

function createSectionReveals(gsap, ScrollTrigger) {
  const triggers = [];
  gsap.utils.toArray(revealSelector).forEach((target) => {
    const tween = gsap.fromTo(target, { opacity: 0, y: 18 }, {
      opacity: 1,
      y: 0,
      duration: .68,
      ease: 'power3.out',
      clearProps: 'opacity,visibility,transform',
      scrollTrigger: { trigger: target, start: 'top 87%', once: true }
    });
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });
  return triggers;
}

function createCardReveals(gsap, ScrollTrigger) {
  const cards = gsap.utils.toArray(cardSelector);
  return ScrollTrigger.batch(cards, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, y: 14, scale: .985 }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: .56,
      stagger: .06,
      ease: 'power3.out',
      clearProps: 'opacity,visibility,transform'
    })
  });
}

function createDecorativeMotion(gsap, ScrollTrigger) {
  const triggers = [];
  document.querySelectorAll('.motion-section').forEach((section, index) => {
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const offset = Math.round((self.progress - .5) * 32);
        section.style.setProperty('--grid-offset', `${offset}px`);
        section.style.setProperty('--ornament-y', `${Math.round(offset * -.45)}px`);
        section.style.setProperty('--ornament-rotate', `${(index % 2 ? -1 : 1) * Math.round(self.progress * 10)}deg`);
      }
    });
    triggers.push(trigger);
  });

  ['.bundle-console', '.abstract-stage'].forEach((selector) => {
    const target = document.querySelector(selector);
    if (!target) return;
    const tween = gsap.fromTo(target, { y: 10 }, {
      y: -10,
      ease: 'none',
      scrollTrigger: { trigger: target, start: 'top bottom', end: 'bottom top', scrub: .45 }
    });
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });
  return triggers;
}

function createHeroMotion(gsap) {
  return gsap.timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('.hero-copy > *', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .58, stagger: .055, clearProps: 'opacity,transform' })
    .fromTo('.hero-visual', { opacity: 0, y: 18, scale: .99 }, { opacity: 1, y: 0, scale: 1, duration: .72, clearProps: 'opacity,transform' }, .1);
}

export async function initMotionSystem() {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  const preference = window.matchMedia(reducedMotionQuery);
  let stopCurrent = () => {};

  const setup = async () => {
    stopCurrent();
    clearMotion(gsap);
    if (preference.matches) return;

    document.documentElement.dataset.motionMode = 'enhanced';
    const context = gsap.context(() => {});
    const hero = createHeroMotion(gsap);
    const sections = createSectionReveals(gsap, ScrollTrigger);
    const cards = createCardReveals(gsap, ScrollTrigger);
    const decorative = createDecorativeMotion(gsap, ScrollTrigger);
    const stage = document.querySelector('#vanguard-abstract-stage');
    let stopAbstract = () => {};
    if (stage) {
      const { initAbstractVanguard } = await import('./abstract-vanguard.js');
      stopAbstract = initAbstractVanguard(stage) || (() => {});
    }

    if (document.fonts?.ready) await document.fonts.ready;
    requestAnimationFrame(() => ScrollTrigger.refresh());
    stopCurrent = () => {
      hero.kill();
      [...sections, ...cards, ...decorative].forEach((trigger) => trigger.kill(true));
      stopAbstract();
      context.revert();
      document.querySelectorAll('.motion-section').forEach((section) => section.removeAttribute('style'));
      clearMotion(gsap);
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
