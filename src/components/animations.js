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
  gsap.from('.hero-visual', { opacity: 0, x: -35, scale: .97, duration: 1.05, delay: .18, ease: 'power3.out' });

  ScrollTrigger.batch('.reveal', {
    start: 'top 90%',
    once: true,
    interval: 0.1,
    batchMax: 4,
    onEnter: (batch) => gsap.fromTo(batch,
      { opacity: 0, y: 34 },
      { opacity: 1, y: 0, duration: .62, stagger: .1, ease: 'power2.out', clearProps: 'transform,opacity' }
    )
  });

  gsap.utils.toArray('.split-heading, .section-heading, .activation-head, .faq-intro').forEach((heading) => {
    gsap.from(heading, {
      scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
      opacity: 0,
      y: 24,
      duration: .65,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    });
  });

  gsap.from('.workflow-list', {
    scrollTrigger: { trigger: '.workflow-list', start: 'top 84%', once: true },
    '--line-progress': 0,
    duration: 1.1,
    ease: 'power2.out'
  });

  gsap.to('.demo-art', {
    scrollTrigger: { trigger: '.demo-section', start: 'top bottom', end: 'bottom top', scrub: .6 },
    yPercent: 9,
    scale: 1.08,
    ease: 'none'
  });

  gsap.from('.bundle-stack > div', {
    scrollTrigger: { trigger: '.bundle-stack', start: 'top 84%', once: true },
    opacity: 0,
    x: -35,
    rotateY: -18,
    duration: .75,
    stagger: .13,
    ease: 'power3.out'
  });
}
