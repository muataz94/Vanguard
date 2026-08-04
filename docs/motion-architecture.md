# Vanguard v4 motion architecture

## Scope

The page uses native browser scrolling. There are no chart-shaped transitions, dividers, rails, overlays, pins, snap points, fixed motion layers, or scroll controllers.

## Interactive chart panel

The visual-demo section contains one lazy-loaded TradingView Advanced Chart with a reserved responsive footprint, loading state, bounded failure fallback, visible attribution, and risk clarification. It does not use a poster, local canvas, autoplay video, WebGL renderer, or Three.js simulation as a second chart.

## Scroll motion

`src/components/motion-system.js` registers GSAP and uses ScrollTrigger only to add reveal classes at local section boundaries. CSS owns the short opacity/transform transitions so the strict static-site CSP does not require inline styles:

- hero entrance with a small upward reveal;
- section-heading, card, pricing, FAQ, TradingView panel, and final-CTA reveals;
- a CSS scroll-timeline progress bar where supported;
- FAQ open/close animation through the Web Animations API.

There is no full-page scrub, parallax, pin, snap point, or runtime style attribute. Every ScrollTrigger reveal uses `once: true`, so reverse scrolling never leaves content hidden.

## Reduced motion

With `prefers-reduced-motion: reduce`, GSAP creates no ScrollTriggers, all content is shown immediately, and the TradingView panel keeps its static loading/error transitions while remaining fully functional.

## Verification

Playwright verifies the mocked TradingView lifecycle and fallback, typography assignments and minimum sizes, reverse scrolling, reduced motion, keyboard navigation, WhatsApp links, legal routes, asset requests, console errors, horizontal overflow, and long tasks. The suite also records responsive screenshots for local review.
