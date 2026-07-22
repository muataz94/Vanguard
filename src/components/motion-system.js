const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function showStaticContent(gsap) {
  gsap.set('.hero-layout, .motion-section, .motion-group, [data-market-portal]', { clearProps: 'all' });
  document.documentElement.dataset.motionMode = 'static';
}

function initHeroReveal(gsap) {
  return gsap.fromTo('.hero-layout', { opacity: 0, y: 20 }, {
    opacity: 1,
    y: 0,
    duration: .7,
    ease: 'power3.out',
    clearProps: 'opacity,transform'
  });
}

function initSectionReveals(gsap, ScrollTrigger, portalSections) {
  const triggers = [];
  document.querySelectorAll('.motion-section').forEach((section) => {
    if (portalSections.has(section)) return;
    const target = section.querySelector('.motion-group') || section.querySelector('.container');
    if (!target) return;
    const tween = gsap.fromTo(target, { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: .7,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: target,
        start: 'top 86%',
        once: true
      }
    });
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });
  return triggers;
}

async function initPortalTransitions(gsap, ScrollTrigger) {
  const zones = [...document.querySelectorAll('[data-market-portal]')];
  if (zones.length !== 4) return { triggers: [], portal: null, portalSections: new Set() };

  const { createMarketPortalSystem } = await import('./market-portal.js');
  const portal = createMarketPortalSystem(zones);
  if (!portal) return { triggers: [], portal: null, portalSections: new Set() };

  const portalSections = new Set();
  const triggers = zones.map((zone, index) => {
    const nextSection = document.querySelector(zone.dataset.nextSection);
    if (nextSection) portalSections.add(nextSection);
    const state = { progress: 0 };
    let trigger;
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    timeline.to(state, {
      progress: 1,
      duration: 1,
      onUpdate: () => {
        if (trigger?.isActive) portal.render(state.progress, index);
      }
    }, 0);
    if (nextSection) {
      timeline.fromTo(nextSection, { opacity: .84, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: .3,
        clearProps: 'opacity,transform'
      }, .7);
    }

    trigger = ScrollTrigger.create({
      id: `market-portal-${index + 1}`,
      trigger: zone,
      start: 'top 92%',
      end: 'bottom 8%',
      animation: timeline,
      scrub: .45,
      invalidateOnRefresh: true,
      onEnter: (self) => portal.render(self.progress, index),
      onEnterBack: (self) => portal.render(self.progress, index),
      onLeave: () => portal.deactivate(index),
      onLeaveBack: () => portal.deactivate(index)
    });
    return trigger;
  });

  return { triggers, portal, portalSections };
}

export async function initMotionSystem() {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger')
  ]);
  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia(REDUCED_MOTION);
  let cleanupCurrent = () => {};

  const setup = async () => {
    cleanupCurrent();
    showStaticContent(gsap);
    if (reducedMotion.matches) return;

    document.documentElement.dataset.motionMode = 'enhanced';
    const context = gsap.context(() => {});
    const heroTween = initHeroReveal(gsap);
    const portalState = await initPortalTransitions(gsap, ScrollTrigger);
    const revealTriggers = initSectionReveals(gsap, ScrollTrigger, portalState.portalSections);
    const allTriggers = [...portalState.triggers, ...revealTriggers];

    if (document.fonts?.ready) await document.fonts.ready;
    requestAnimationFrame(() => ScrollTrigger.refresh());

    cleanupCurrent = () => {
      heroTween.kill();
      allTriggers.forEach((trigger) => trigger.kill(true));
      portalState.portal?.dispose();
      context.revert();
      showStaticContent(gsap);
    };
  };

  await setup();
  const onPreferenceChange = () => { setup(); };
  reducedMotion.addEventListener('change', onPreferenceChange);

  const cleanup = () => {
    reducedMotion.removeEventListener('change', onPreferenceChange);
    cleanupCurrent();
  };
  window.addEventListener('pagehide', cleanup, { once: true });
  return cleanup;
}
