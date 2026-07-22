# Vanguard motion revamp audit

Audit date: 22 July 2026  
Audited branch baseline: `origin/main` at `e54afb8`  
Live URL: `https://muataz94.github.io/Vanguard/`

## Current page structure

The landing page currently renders these chapters in order:

1. Hero
2. Problem
3. How it works
4. Benefits
5. Product demo
6. Package contents
7. Markets
8. Evidence
9. Pricing
10. Activation
11. FAQ
12. Risk disclosure
13. Final CTA

The legal routes are separate Vite entry points: privacy, terms, refund, risk disclosure, and 404.

## Motion and transition findings

- `src/components/animations.js` dynamically prepends a `.section-candle-transition` to every main section after the hero through `buildCandleTransition()` and `initSectionTransitions()`.
- The live page creates 12 transition hosts and 12 overlays. Each overlay contains 13 candles, for 156 dynamically created candle elements.
- Every non-hero section receives `.section-transition-host`. `public/revision.css` gives that class `overflow: clip`, which can crop focus rings, content, tooltips, and the transition itself.
- Each incoming section's direct children start at `opacity: 0.12` and move from 42px on mobile or 78px on desktop. The entire entrance is continuously tied to scroll with `scrub: 0.35` or `0.65`.
- Each repeated transition is absolutely positioned above the section and layered at `z-index: 4`, while normal section content is pushed to `z-index: 2`. The dark overlay can cover readable content during entry.
- The transition CSS uses persistent `will-change` on every overlay and candle. With 168 animated transition nodes, this creates unnecessary layer pressure.
- The source still contains the old fixed `.market-scroll-effect`, line, candles, value, and scroll listener. A later stylesheet only hides the rail with `display: none !important`, leaving its markup, CSS, DOM queries, and per-scroll updates as dead code.
- The current source produces approximately 16 ScrollTriggers: 12 section transitions, one demo parallax trigger, and three separate package-visual triggers. This exceeds the requested budget.
- Section content and cards also use `.reveal`; CSS and GSAP both affect transforms/opacity in different layers, making ownership difficult to reason about.
- `ScrollTrigger.refresh()` runs immediately inside animation initialization rather than after fonts and the responsive layout are ready.
- The demo image uses continuously scrubbed scale and vertical movement. The FAQ introduction is sticky, and the header is sticky. The prompt calls for removing long sticky chapter text, so the FAQ treatment must change.
- Global smooth scrolling is enabled in CSS. It is disabled only in the reduced-motion media query.
- Clip paths are used on hero/demo/package decorative shapes. Those are visual-only treatments, but normal section containers should not inherit clipping.

## Content and configuration findings

- The live page visibly exposes `support@example.com`, `[يجب الاستكمال قبل النشر]`, demo production instructions, and three placeholder evidence cards.
- `siteConfig.product.showEvidence` is `true` even though every evidence asset and label is explicitly a placeholder. Testimonials are already hidden.
- The six-month pricing card renders an internal development warning publicly. Its USD 450 price is also higher than buying two three-month plans at USD 199 each.
- The footer writes incomplete legal name/address values directly into the public page.
- Legal pages also render incomplete identity values and multiple developer-facing placeholder alerts. The legal content must retain honest uncertainty without exposing raw bracket tokens or fake business details.
- The WhatsApp number is configured and the live links use `https://wa.me/9647717220578`; no failed WhatsApp configuration was found.
- The demo has no real video. The public UI currently explains what a future video should contain instead of presenting a finished simulated walkthrough.
- FAQ copy exposes owner TODO language for repainting, supported markets, refunds, updates, multiple accounts, and support email.

## Layout, accessibility, and performance findings

- Live desktop audit at 1440×900 returned HTTP 200 with no initial console errors, request failures, or horizontal overflow.
- Live mobile audit at 390×844 also showed no horizontal overflow or network failure, but the page height was about 17,330px. Repeated transitions and placeholder evidence materially lengthen the journey.
- At the top after a full down/up pass, off-screen readable content can remain at reduced opacity because entrance state is tied to scrubbed scroll progress.
- The mobile CTA is fixed at the viewport bottom and the scroll-to-top button sits above it; their geometry does not overlap, but bottom page padding must continue to reserve space.
- The menu has an Escape handler and focus trap, FAQ buttons maintain ARIA state, the skip link is present, and the document direction is RTL.
- Tooltips are injected globally and repositioned on every scroll whenever active. They duplicate body copy, add interaction noise, and are not useful on touch devices.
- Three.js uses low-power rendering and an intersection observer, but it still runs continuous rotation while visible. Reduced-motion correctly skips the canvas; the revised scene must also stop rotating for reduced motion and keep a static fallback.
- The current automated test suite asserts the old market rail and visible development warnings, so it protects behavior that must be removed. It also cannot target the live site cleanly because its `webServer` remains mandatory when `TEST_BASE_URL` is remote.

## Asset and deployment findings

- The Vite base is correctly `/Vanguard/`, and the live logo, favicon, CSS, JavaScript, screenshot placeholders, and WhatsApp asset loaded without failed requests in the audit.
- `index.html` references `public/revision.css`, which duplicates and overrides the main stylesheet. This extra override layer is the source of the repeated transition styling and should be removed rather than patched.
- The social image filename still contains `placeholder`, even though it is public metadata.
- Legal routes are valid Vite multi-page inputs and must remain directly addressable after the revamp.

## Required replacement

The repeated transition builder, fixed market rail, and revision override stylesheet were replaced with normal browser scrolling, restrained one-time reveals, four in-flow market-portal zones, one shared Three.js canvas, a static reduced-motion fallback, and no animation of layout properties during scroll.

## Remediation completed

- Removed `src/components/animations.js`, `public/revision.css`, the fixed market rail, dynamic transition builders, their CSS, tooltips, and associated scroll work.
- Added `src/components/motion-system.js` with four scrubbed portal triggers and six one-time section reveals.
- Added `src/components/market-portal.js`: one renderer, one canvas, two instanced candle meshes, reusable geometry/materials, one torus, and no continuous render loop.
- Authored exactly four market-portal zones in normal document flow and one reusable SVG/CSS fallback symbol.
- Removed the separate hero Three.js scene so the page now has a single WebGL canvas.
- Rebuilt the Arabic RTL layout, visual demo, package presentation, pricing treatment, header, navigation, mobile menu, risk panel, footer, and responsive behavior.
- Disabled evidence until real examples exist and removed public placeholder screenshots/video instructions.
- Removed public support-email and legal-identity placeholders; unresolved values now remain owner inputs and development-only warnings.
- Corrected public asset URLs so Vite development and the `/Vanguard/` production base both load the real logo without duplicated paths.
- Updated the legal pages to use neutral, factual wording while preserving the complete trading-risk disclosure.
- Updated `sharp` to 0.35.3 after `npm audit` found a high-severity inherited libvips advisory; the final audit reports zero vulnerabilities.

## Verification results

- `npm install`: completed.
- `npm audit`: zero vulnerabilities after the dependency update.
- `npm run build`: completed with all six HTML outputs.
- Development Playwright run: 27/27 passed for the shared portal implementation.
- Production preview Playwright run: 27/27 passed after the final material and visibility fix.
- Target widths from 320px through 1920px: no horizontal overflow.
- Console errors and failed requests: none in the automated runs.
- Reverse scrolling and reduced motion: all readable content remains visible.
- Lighthouse mobile preview: Performance 78, Accessibility 100, Best Practices 100, SEO 100. The Windows CLI returned an `EPERM` cleanup error after writing the complete JSON report; the scores above were parsed from that report.
