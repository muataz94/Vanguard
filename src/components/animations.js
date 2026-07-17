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

  gsap.from('.bundle-core', {
    scrollTrigger: { trigger: '.bundle-visual', start: 'top 82%', once: true },
    opacity: 0,
    scale: .55,
    rotate: -18,
    duration: 1,
    ease: 'back.out(1.35)'
  });
  gsap.from('.bundle-orbit', {
    scrollTrigger: { trigger: '.bundle-visual', start: 'top 82%', once: true },
    opacity: 0,
    scale: .7,
    duration: 1.15,
    stagger: .16,
    ease: 'power3.out'
  });
  gsap.from('.bundle-node', {
    scrollTrigger: { trigger: '.bundle-visual', start: 'top 76%', once: true },
    opacity: 0,
    y: 18,
    duration: .58,
    stagger: .12,
    ease: 'power2.out',
    clearProps: 'transform,opacity'
  });
  gsap.from('.bundle-feature', {
    scrollTrigger: { trigger: '.bundle-features', start: 'top 86%', once: true },
    opacity: 0,
    x: 24,
    duration: .62,
    stagger: .1,
    ease: 'power2.out',
    clearProps: 'transform,opacity'
  });

  gsap.from('.evidence-card .evidence-media', {
    scrollTrigger: { trigger: '.evidence-showcase', start: 'top 84%', once: true },
    clipPath: 'inset(0 0 100% 0)',
    duration: .9,
    stagger: .14,
    ease: 'power3.inOut',
    clearProps: 'clipPath'
  });
  gsap.from('.evidence-copy > *', {
    scrollTrigger: { trigger: '.evidence-showcase', start: 'top 78%', once: true },
    opacity: 0,
    y: 18,
    duration: .52,
    stagger: .055,
    ease: 'power2.out',
    clearProps: 'transform,opacity'
  });

  gsap.utils.toArray('.section-index').forEach((label) => {
    gsap.from(label, {
      scrollTrigger: { trigger: label, start: 'top 93%', once: true },
      opacity: 0,
      x: 20,
      duration: .5,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    });
  });
}
