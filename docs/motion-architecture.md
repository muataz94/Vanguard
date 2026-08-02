# Vanguard v4 motion architecture

## Scope

The page uses native browser scrolling. There are no chart-shaped transitions, dividers, rails, overlays, pins, snap points, fixed motion layers, or scroll controllers.

## Indicator preview

The visual-demo section uses the supplied `public/images/vanguard-indicator-preview.png` screenshot. It is rendered as a responsive semantic figure with intrinsic dimensions and a visible risk clarification. The page has no WebGL renderer or Three.js dependency.

## Scroll motion

`src/components/motion-system.js` registers GSAP and uses ScrollTrigger only to add reveal classes at local section boundaries. CSS owns the short opacity/transform transitions so the strict static-site CSP does not require inline styles:

- hero entrance with a small upward reveal;
- section-heading, card, pricing, FAQ, indicator-preview, and final-CTA reveals;
- a CSS scroll-timeline progress bar where supported;
- FAQ open/close animation through the Web Animations API.

There is no full-page scrub, parallax, pin, snap point, or runtime style attribute. Every ScrollTrigger reveal uses `once: true`, so reverse scrolling never leaves content hidden.

## Reduced motion

With `prefers-reduced-motion: reduce`, GSAP creates no ScrollTriggers and all content, including the indicator screenshot, is shown immediately.

## Verification

Playwright verifies the supplied screenshot, typography assignments and minimum sizes, reverse scrolling, reduced motion, keyboard navigation, WhatsApp links, legal routes, asset requests, console errors, horizontal overflow, and long tasks. The suite also records responsive screenshots.
