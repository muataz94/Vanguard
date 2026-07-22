# Vanguard motion architecture

## Goals

The revamp uses motion to mark chapter changes without taking control of scrolling or covering content. Browser scrolling remains native; no smooth-scroll library, scroll snap, pinning, or fixed market rail is used.

## Runtime structure

`src/components/motion-system.js` owns all GSAP behavior. It creates one `gsap.context()` and one `gsap.matchMedia()` scope so animations can be reverted cleanly on page exit or responsive changes.

The production page has 12 intentional ScrollTriggers:

- Eight one-time group reveals: problem, benefits, workflow, demo, package contents, pricing, FAQ, and risk disclosure.
- Four candle-bridge timelines.

Markets, activation steps, the footer, legal content, and the final CTA remain immediately visible and do not consume ScrollTriggers.

## Section reveals

Each reveal targets a major `.motion-group`, not individual words or paragraphs. It uses opacity and `translateY` only:

- Desktop distance: 24px.
- Mobile distance: 16px.
- Duration: 0.72 seconds.
- Easing: `power3.out`.
- Start: `top 86%`.
- `once: true`, followed by clearing inline opacity and transform.

The hero entrance is desktop-only. Mobile renders the hero immediately so content visibility is never delayed on smaller devices.

## Candle bridges

The four `.candle-bridge` components are authored directly in `index.html`. No bridge is injected at runtime. They sit between:

1. Hero and problem.
2. How it works and the visual demo.
3. Package contents and evidence/pricing.
4. FAQ and risk/final CTA.

Each bridge is a 132px in-flow box on desktop and an 88px box on mobile. Desktop shows seven candles; CSS hides the last two on mobile. Absolute positioning is confined to the divider itself. Each bridge timeline uses `toggleActions: "play none none reverse"`, no pinning, and no scrub. Candles move from `scaleY: 0.15` and opacity 0 to their authored size and opacity 1.

## Reduced motion and mobile

When `prefers-reduced-motion: reduce` is active:

- GSAP creates no ScrollTriggers.
- All groups and bridges are shown immediately.
- Three.js does not load.
- CSS transitions and animations collapse to effectively zero duration.

At 860px and below, the Three.js module exits before renderer creation. The CSS fallback remains visible and the mobile hero is static. This reduced mobile JavaScript cost and improved measured Lighthouse Total Blocking Time from 1080ms on the baseline implementation to 160ms after the revamp optimizations.

## Three.js lifecycle

Desktop Three.js is dynamically imported after page load and browser idle time. Rendering pauses outside the hero through `IntersectionObserver`, stops when the document is hidden, caps device pixel ratio at 1.5, and disposes geometry, materials, and the renderer during cleanup.

## Refresh and cleanup

`ScrollTrigger.refresh()` is called once after `document.fonts.ready` and a layout frame. The GSAP context is reverted on `pagehide`. There are no layout reads inside the scroll handler; the separate progress/header handler is passive and requestAnimationFrame-throttled.

## CSS ownership

GSAP owns only runtime opacity and transforms for motion groups and bridge children. CSS owns layout, color, hover states, and the reduced-motion static fallback. No CSS scroll timeline controls the same elements. No full section uses `overflow: clip`.

## Verification

`tests/landing-page.spec.js` checks downward and upward scrolling, reduced motion, target viewport overflow, keyboard behavior, motion visibility, asset failures, and long tasks. The same 23-test suite was run against both Vite development and the production preview.
