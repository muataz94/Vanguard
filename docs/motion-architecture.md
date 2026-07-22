# Vanguard Market Portal motion architecture

## Goals

The page uses native browser scrolling. There is no smooth-scroll controller, page-level scroll interception, scroll snap, fixed transition overlay, or pinned section. Motion is contained inside four in-flow visual transition zones and never sits above readable content.

## Runtime structure

`src/components/motion-system.js` owns GSAP and ScrollTrigger. `src/components/market-portal.js` owns one reusable Three.js scene and renderer. The system creates:

- Four scrubbed portal ScrollTriggers, one for each major chapter boundary.
- Six one-time section reveals for ordinary content groups.
- One non-scroll-triggered hero entrance.

The four sections introduced by portals are faded upward by their portal timelines and are excluded from the ordinary reveal list, avoiding duplicate animation ownership.

## Shared WebGL scene

Only one `WebGLRenderer` and one canvas exist. When a transition becomes active, the canvas is moved into that zone's in-flow mount. The scene reuses:

- One box geometry for every candle body and wick.
- Two `InstancedMesh` objects for all candle bodies and wicks.
- One candle material shared by both instanced meshes.
- One torus geometry/material and one grid geometry/material.

There are no shadows, lights, post-processing passes, or animation loops. The renderer draws only from an active ScrollTrigger update or an active-zone resize. Device pixel ratio is capped at 1.5 on tablet/desktop and 1.15 on mobile.

## Portal sequence

Each `.market-portal` is a normal-flow visual box between major chapters. Its ScrollTrigger uses `scrub: 0.45`, `start: "top 92%"`, and `end: "bottom 8%"`, with no pinning or snap.

As progress advances:

1. Candles grow vertically from the chart floor.
2. Their instanced positions converge into a loose V based on the Vanguard logo geometry.
3. A translucent green torus appears behind the V.
4. Candles move away from the center while the camera advances through the torus.
5. The next section moves from 20px below and partial opacity to its final position.

Reverse scrolling drives the same state backward because the sequence is a scrubbed timeline rather than a one-way event animation.

## Responsive budgets

- Desktop above 960px: 22 candles.
- Tablet from 621px through 960px: 14 candles.
- Mobile through 620px: 8 candles.

All three values stay inside the requested budgets. A resize updates the instance count without creating new meshes, materials, or renderers.

## Normal section reveals

Ordinary motion sections use one reveal on a single major group: opacity plus `translateY(20px)`, 0.7 seconds, `power3.out`, starting at `top 86%`, with `once: true`. Inline opacity and transform are cleared on completion.

## Fallback and reduced motion

The HTML contains a reusable SVG symbol showing a candle V, grid, and portal. Every zone references that symbol, so a complete static visual exists before JavaScript and when WebGL is unavailable.

With `prefers-reduced-motion: reduce`:

- Three.js is not imported and no canvas is created.
- No ScrollTriggers are created.
- Camera and object motion are therefore completely absent.
- All readable content is immediately visible with transforms removed.
- The static SVG/CSS portal remains visible.

The preference is observed at runtime; changing it rebuilds or removes the enhanced motion safely.

## Cleanup

After fonts are ready, one `ScrollTrigger.refresh()` aligns the four zones with the final layout. On `pagehide` or a reduced-motion preference change, triggers are killed, the shared renderer and reusable resources are disposed, inline motion state is cleared, and the page remains usable as a static document.

## Verification

`tests/landing-page.spec.js` verifies the single-canvas invariant, exactly four portal zones, 22/14/8 responsive candle budgets, forward and reverse scrub progress, render-idle behavior outside an active zone, reduced-motion canvas removal, desktop/mobile overflow, console and request failures, keyboard behavior, direct legal routes, and long tasks. The current suite contains 27 passing browser tests.
