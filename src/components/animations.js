export async function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger')
  ]);
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-copy > *', { opacity: 0, y: 22, duration: 0.75, stagger: 0.08, ease: 'power2.out' });
  gsap.utils.toArray('.reveal').forEach((element) => {
    gsap.from(element, {
      scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      opacity: 0,
      y: 24,
      duration: 0.55,
      ease: 'power2.out'
    });
  });
}
