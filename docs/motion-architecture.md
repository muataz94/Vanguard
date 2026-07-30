# Vanguard v4 motion architecture

## Scope

The page uses native browser scrolling. There are no chart-shaped transitions, dividers, rails, overlays, pins, snap points, fixed motion layers, or scroll controllers.

## Shared Three.js renderer

`src/components/abstract-vanguard.js` owns the only WebGL renderer. It mounts inside `#vanguard-abstract-stage` in the visual-demo section and renders an abstract V-inspired form using black, Vanguard green, and soft white.

The scene reuses two arm meshes with a shared box geometry, one core geometry, one ring geometry, and three restrained materials. It has no shadows or post-processing. Pixel ratio is capped at 1.5 on desktop/tablet and 1.2 on mobile.

Animation is intentionally slow: a gentle rotation, small vertical float, core-scale pulse, ring rotation, and optional pointer parallax. An IntersectionObserver and visibility listener cancel the animation frame whenever the scene is off-screen or the document is hidden. CSS supplies the static V-form fallback before JavaScript, on WebGL failure, and in reduced-motion mode.

## Scroll motion

`src/components/motion-system.js` registers GSAP and uses ScrollTrigger only to add reveal classes at local section boundaries. CSS owns the short opacity/transform transitions so the strict static-site CSP does not require inline styles:

- hero entrance with a small upward reveal;
- section-heading, card, pricing, FAQ, abstract-stage, and final-CTA reveals;
- a CSS scroll-timeline progress bar where supported;
- FAQ open/close animation through the Web Animations API.

There is no full-page scrub, parallax, pin, snap point, or runtime style attribute. Every ScrollTrigger reveal uses `once: true`, so reverse scrolling never leaves content hidden.

## Reduced motion

With `prefers-reduced-motion: reduce`, GSAP creates no ScrollTriggers, the Three.js module is not imported, no canvas is created, and all content is shown immediately. The CSS fallback remains visible and no camera or parallax movement occurs.

## Verification

Playwright verifies desktop, tablet, and mobile renderer pixel-ratio caps; reverse scrolling; off-screen render pause; reduced-motion canvas removal; keyboard navigation; WhatsApp links; legal routes; asset requests; console errors; horizontal overflow; and long tasks. The suite also records screenshots and a scroll-test video.
