const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function showStaticContent(gsap) {
  gsap.set('.motion-group, .candle-bridge, .candle-bridge__candles span, .candle-bridge__line, .candle-bridge__label', {
    clearProps: 'all'
  });
}

function initHeroMotion(gsap) {
  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  timeline
    .fromTo('.hero-copy > *', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: .68,
      stagger: .055,
      clearProps: 'opacity,transform'
    })
    .fromTo('.hero-visual', { opacity: 0, y: 18 }, {
      opacity: 1,
      y: 0,
      duration: .82,
      clearProps: 'opacity,transform'
    }, .12);
  return timeline;
}

function initSectionReveals(gsap, ScrollTrigger, distance) {
  const selectors = [
    '.problem-section .motion-group',
    '#benefits .motion-group',
    '#how-it-works .motion-group',
    '#demo .motion-group',
    '.bundle-section .motion-group',
    '#pricing .motion-group',
    '#faq .motion-group',
    '.risk-section .motion-group'
  ];

  selectors.forEach((selector) => {
    const target = document.querySelector(selector);
    if (!target) return;
    gsap.fromTo(target, { opacity: 0, y: distance }, {
      opacity: 1,
      y: 0,
      duration: .72,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: target,
        start: 'top 86%',
        once: true
      }
    });
  });
}

function initCandleBridges(gsap, mobile) {
  document.querySelectorAll('.candle-bridge').forEach((bridge) => {
    const candles = bridge.querySelectorAll('.candle-bridge__candles span');
    const line = bridge.querySelector('.candle-bridge__line');
    const label = bridge.querySelector('.candle-bridge__label');
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: bridge,
        start: 'top 88%',
        end: 'bottom 55%',
        toggleActions: 'play none none reverse'
      }
    });

    timeline
      .fromTo(line, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: .68 }, 0)
      .fromTo(candles, { scaleY: .15, opacity: 0 }, {
        scaleY: 1,
        opacity: 1,
        duration: mobile ? .58 : .72,
        stagger: mobile ? .045 : .06
      }, .04)
      .fromTo(label, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .42 }, .22);
  });
}

export async function initMotionSystem() {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger')
  ]);
  gsap.registerPlugin(ScrollTrigger);

  const context = gsap.context(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 621px)',
      mobile: '(max-width: 620px)',
      reduceMotion: REDUCED_MOTION
    }, ({ conditions }) => {
      if (conditions.reduceMotion) {
        showStaticContent(gsap);
        return undefined;
      }

      if (conditions.desktop) initHeroMotion(gsap);
      initSectionReveals(gsap, ScrollTrigger, conditions.mobile ? 16 : 24);
      initCandleBridges(gsap, conditions.mobile);
      return undefined;
    });
  });

  if (document.fonts?.ready) await document.fonts.ready;
  requestAnimationFrame(() => ScrollTrigger.refresh());

  const cleanup = () => context.revert();
  window.addEventListener('pagehide', cleanup, { once: true });
  return cleanup;
}
