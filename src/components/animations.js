function buildCandleTransition(section, index) {
  const existing = section.querySelector(':scope > .section-candle-transition');
  if (existing) return existing;

  const heights = [42, 66, 54, 82, 61, 92, 70, 104, 76, 116, 88, 126, 96];
  const directions = ['up', 'up', 'down', 'up', 'down', 'up', 'up', 'down', 'up', 'up', 'down', 'up', 'up'];
  const candles = heights.map((height, candleIndex) => (
    `<span class="section-candle section-candle--${directions[candleIndex]}" style="--candle-height:${height}px;--candle-delay:${candleIndex}"><i></i></span>`
  )).join('');

  const transition = document.createElement('div');
  transition.className = 'section-candle-transition';
  transition.setAttribute('aria-hidden', 'true');
  transition.innerHTML = `
    <div class="section-candle-grid"></div>
    <span class="section-candle-price-line"></span>
    <div class="section-candle-chart">${candles}</div>
    <div class="section-candle-meta"><span>FOREX / SCROLL</span><b>V•${String(index + 1).padStart(2, '0')}</b></div>
  `;

  section.classList.add('section-transition-host');
  section.prepend(transition);
  return transition;
}

function initSectionTransitions(gsap) {
  const sections = gsap.utils.toArray('main > section:not(.hero)');
  const media = gsap.matchMedia();

  media.add({
    desktop: '(min-width: 801px)',
    mobile: '(max-width: 800px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, (context) => {
    const { desktop, mobile, reduceMotion } = context.conditions;
    if (reduceMotion) return undefined;

    sections.forEach((section, index) => {
      const transition = buildCandleTransition(section, index);
      const candles = transition.querySelectorAll('.section-candle');
      const priceLine = transition.querySelector('.section-candle-price-line');
      const meta = transition.querySelector('.section-candle-meta');
      const content = [...section.children].filter((child) => child !== transition);

      gsap.set(transition, { autoAlpha: 0, y: mobile ? 24 : 42 });
      gsap.set(candles, { autoAlpha: 0, scaleY: 0.06 });
      gsap.set(priceLine, { scaleX: 0 });
      gsap.set(meta, { autoAlpha: 0, y: 10 });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: mobile ? 'top 94%' : 'top 96%',
          end: mobile ? 'top 46%' : 'top 36%',
          scrub: mobile ? 0.35 : 0.65,
          invalidateOnRefresh: true
        }
      });

      timeline
        .to(transition, { autoAlpha: 1, y: 0, duration: 0.08 }, 0)
        .to(priceLine, { scaleX: 1, duration: 0.34 }, 0)
        .to(meta, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.04)
        .to(candles, {
          autoAlpha: 1,
          scaleY: 1,
          duration: 0.44,
          stagger: { each: desktop ? 0.022 : 0.016, from: 'start' }
        }, 0.05)
        .fromTo(content,
          { autoAlpha: 0.12, y: mobile ? 42 : 78 },
          { autoAlpha: 1, y: 0, duration: 0.64 },
          0.18
        )
        .to(transition, {
          autoAlpha: 0,
          y: mobile ? -18 : -38,
          duration: 0.24
        }, 0.76);
    });

    return undefined;
  });

  return media;
}

export async function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger')
  ]);
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-copy > *', {
    opacity: 0,
    y: 28,
    duration: 0.78,
    stagger: 0.075,
    ease: 'power3.out',
    clearProps: 'transform,opacity'
  });
  gsap.from('.hero-visual', {
    opacity: 0,
    x: -35,
    scale: 0.97,
    duration: 1.05,
    delay: 0.18,
    ease: 'power3.out',
    clearProps: 'transform,opacity'
  });

  initSectionTransitions(gsap);

  gsap.to('.demo-art', {
    scrollTrigger: {
      trigger: '.demo-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6
    },
    yPercent: 6,
    scale: 1.045,
    ease: 'none'
  });

  gsap.from('.bundle-core', {
    scrollTrigger: { trigger: '.bundle-visual', start: 'top 82%', once: true },
    opacity: 0,
    scale: 0.72,
    rotate: -10,
    duration: 0.85,
    ease: 'back.out(1.2)'
  });
  gsap.from('.bundle-orbit', {
    scrollTrigger: { trigger: '.bundle-visual', start: 'top 82%', once: true },
    opacity: 0,
    scale: 0.82,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out'
  });
  gsap.from('.bundle-node', {
    scrollTrigger: { trigger: '.bundle-visual', start: 'top 76%', once: true },
    opacity: 0,
    y: 14,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    clearProps: 'transform,opacity'
  });

  ScrollTrigger.refresh();
}
