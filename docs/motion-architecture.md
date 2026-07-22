# Vanguard v4 motion architecture

## Scope

The page uses native browser scrolling. There are no chart-shaped transitions, dividers, rails, overlays, pins, snap points, fixed motion layers, or scroll controllers.

## Shared Three.js renderer

`src/components/abstract-vanguard.js` owns the only WebGL renderer. It mounts inside `#vanguard-abstract-stage` in the visual-demo section and renders an abstract V-inspired form using black, Vanguard green, and soft white.

The scene reuses two arm meshes with a shared box geometry, one core geometry, one ring geometry, and three restrained materials. It has no shadows or post-processing. Pixel ratio is capped at 1.5 on desktop/tablet and 1.2 on mobile.

Animation is intentionally slow: a gentle rotation, small vertical float, core-scale pulse, ring rotation, and optional pointer parallax. An IntersectionObserver and visibility listener cancel the animation frame whenever the scene is off-screen or the document is hidden. CSS supplies the static V-form fallback before JavaScript, on WebGL failure, and in reduced-motion mode.

## Scroll motion

`src/components/motion-system.js` uses GSAP and ScrollTrigger only for local, content-safe effects:

- hero entrance with a small upward reveal;
- section-heading opacity/18px reveals;
- staggered card and pricing entrances with a 14px movement;
- a clipped/masked abstract-stage entrance;
- short controlled parallax on the package console and abstract form;
- progress-linked background grid and decorative-outline accents;
- FAQ item entrances while FAQ open/close remains accessible native JavaScript;
- final CTA entrance.

There is no full-page scrub. The two parallax effects use only `scrub: 0.45` over their own element ranges. Every reveal uses `once: true` and clears inline transforms after it completes, so reverse scrolling never leaves content hidden.

## Reduced motion

With `prefers-reduced-motion: reduce`, GSAP creates no ScrollTriggers, the Three.js module is not imported, no canvas is created, and all content is shown immediately. The CSS fallback remains visible and no camera or parallax movement occurs.

## Verification

Playwright verifies desktop, tablet, and mobile renderer pixel-ratio caps; reverse scrolling; off-screen render pause; reduced-motion canvas removal; keyboard navigation; WhatsApp links; legal routes; asset requests; console errors; horizontal overflow; and long tasks. The suite also records screenshots and a scroll-test video.
