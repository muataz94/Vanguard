# Vanguard v4 motion audit

## Removed

- All portal transition zones and their SVG fallbacks.
- All instantiated market-bar geometry and renderer lifecycle code.
- The previous bar-chart visual in the hero and the previous visual-demo panel.
- Every portal-specific test, responsive count check, CSS rule, and documentation claim.
- The separate market-bar icon so that graphic treatment no longer remains in the interface.

## Current design

The hero is free of market-bar graphics and uses only a static analytical matrix. The visual-demo section contains the one shared continuously animated Three.js abstract Vanguard form. Its fallback is a static CSS V form and ring.

GSAP registers ScrollTrigger, which adds classes for section-local reveals. CSS performs the short opacity/transform transitions without runtime inline styles, allowing the strict CSP to remain free of `unsafe-inline`. Native scroll remains in charge and no readable content is positioned beneath a transition overlay.

## Before and after evidence

| Before v4 | After v4 |
| --- | --- |
| Four in-flow transition zones and a chart-shaped visual treatment. | No transition zones or chart-shaped decorative graphics. |
| A renderer dedicated to zone-to-zone travel. | One renderer dedicated to the visible abstract Vanguard form. |
| Scroll-linked transition state around chapter boundaries. | One-time class-driven section reveals and a CSS scroll progress accent while browser scrolling remains native. |
| No continuously animated brand form in the visual demo. | A low-density V-inspired form with light rotation, float, pulse, and off-screen pause. |

The Playwright evidence run writes desktop, mobile, pricing, abstract-form, and reverse-scroll video artifacts under `artifacts/v4-*`. These remain local verification outputs and are not part of the production source tree.

## Guardrails

- Trading-risk disclosure and legal routes remain intact.
- Contact and pricing data remain sourced from `src/config.js`.
- No public placeholder, testimonial, result, or unverified evidence is introduced.
- Reduced-motion mode creates no renderer and immediately exposes all content.
