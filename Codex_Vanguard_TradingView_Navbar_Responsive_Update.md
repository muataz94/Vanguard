# Codex Task — Relocate the Interactive TradingView Panel, Restore the Vanguard Image, and Repair the Navbar

Work inside the existing **Vanguard Indicator** repository:

- Repository: `https://github.com/muataz94/Vanguard`
- Target branch: `main`
- Production URL: `https://muataz94.github.io/Vanguard/`
- Vite base path: `/Vanguard/`

Complete the implementation, verification, commit, and push. Do not stop after writing a plan or describing sample code.

## 1. Required outcome

Make one focused production update:

1. Keep **exactly one real interactive TradingView chart panel** and move it into the first/hero section, immediately below the visible risk disclaimer.
2. Do not restore any poster, fake chart, local canvas simulation, autoplay video, or second TradingView widget.
3. Restore `public/images/vanguard-indicator-preview.png` to its original visual-demo position in `#demo`; the TradingView widget must not replace this image.
4. Replace the broken/duplicated current navbar with the approved premium floating-navbar design described below.
5. Preserve the official Vanguard logo exactly as stored in the repository.
6. Make the complete landing page responsive and collision-free at desktop, tablet, and mobile sizes.
7. Audit spacing across all landing-page text so Arabic and English never overlap, clip, or crowd adjacent content.
8. Preserve all working bilingual, RTL/LTR, theme, accessibility, market-explorer, pricing, FAQ, WhatsApp, and legal functionality.
9. Run the complete verification suite, commit only scoped files, and push safely to `origin/main`.

## 2. Inspect before editing

Before changing code:

1. Read `AGENTS.md` completely and obey it.
2. Run `git status --short --branch`.
3. Confirm the active branch and `origin` URL.
4. Fetch `origin` and compare the local branch with `origin/main`.
5. Inspect:
   - `index.html`
   - `src/main.js`
   - `src/styles.css`
   - `src/i18n.js`
   - `src/components/theme.js`
   - `src/components/motion-system.js`
   - all files under `src/components/` related to navigation or charts
   - `tests/landing-page.spec.js`
   - `tests/i18n-market.spec.js`
   - `tests/security-accessibility.spec.js`
   - the Content Security Policy in every HTML entry point
   - the official logo assets under `public/assets/`
6. Review Git history, especially commit `9734ffa` (`feat: add interactive TradingView chart to hero`). It contains a previous working TradingView loader and test approach. Reuse sound ideas selectively, but do not blindly revert or cherry-pick the commit because the current site contains newer bilingual, navbar, spacing, market-explorer, and animation work that must remain.
7. Inspect the current live page and local preview before editing. Record the TradingView widget's current position, the missing/displaced Vanguard indicator image, the duplicated navbar/CTA shown in the supplied screenshot, overflow, text collisions, console errors, and failed network requests.

If unrelated user changes exist, do not overwrite, stage, or commit them. Stop if they overlap the required files and cannot be preserved safely.

## 3. Keep exactly one interactive TradingView panel and relocate it

The real interactive TradingView panel is present but is in the wrong place. Reuse its working loader and lifecycle logic, move its rendered container to the required hero position, and do not create a second instance during the relocation.

### Single-instance rule

The final page must contain exactly one TradingView Advanced Chart instance:

- one widget container;
- one external widget loader script at a time;
- one rendered TradingView iframe after loading;
- no duplicate widget after theme or language changes;
- no second hidden iframe;
- no static poster presented as another chart;
- no autoplay market video;
- no local canvas pretending to be TradingView;
- no random or fabricated market data.

Use a stable selector such as:

```html
data-tradingview-widget
```

Add an automated assertion that the page contains exactly one matching widget and, after successful mocked loading, exactly one TradingView iframe.

### Exact placement and page order

The current placement is wrong. Move the interactive TradingView panel out of `#demo` and place it in the first/hero section directly below this visible disclaimer:

```text
أداة تحليلية مساعدة وليست توصية مالية أو ضماناً للنتائج. تحقق من كل إعداد وأدر المخاطر قبل التداول.
```

English equivalent:

```text
An analytical support tool, not financial advice or a guarantee of results. Verify every setup and manage risk before trading.
```

Required visible hero order:

1. eyebrow;
2. hero heading;
3. three-paragraph hero description;
4. CTA row;
5. trust items;
6. `.risk-note` containing the disclaimer above;
7. **the single interactive TradingView panel**;
8. the existing hero ticker or the next section.

The TradingView panel must be the next major visible block after `.risk-note`. Do not place another paragraph, CTA, decorative image, or full section between the disclaimer and the widget. A concise accessible heading/label may be integrated inside the widget card, but it must not create a separate section or weaken the direct visual relationship.

Keep the panel within the hero's main container and give it deliberate responsive spacing, for example `margin-block-start: clamp(1.5rem, 3vw, 2.5rem)`. Reserve its dimensions before the third-party script loads to prevent layout shift. The widget must not overlap the hero text, CTAs, navbar, or ticker.

### Restore the Vanguard Indicator image

Return the existing local product image to the separate visual-demo section (`#demo`) in its original `indicator-preview` figure:

```text
public/images/vanguard-indicator-preview.png
```

Requirements:

- preserve the existing image asset; do not regenerate, crop, recolor, or replace it;
- preserve its existing translated alt text and the `indicator-preview` caption/step interaction;
- keep it lazy-loaded and responsive;
- use it as the principal visual inside `#demo`, in the location currently occupied by the TradingView widget;
- do not use it as the TradingView loading/error fallback;
- do not present the image as live data;
- do not remove or duplicate the image elsewhere;
- ensure `#demo` contains the Vanguard image and contains no TradingView iframe or loader script.

The final page intentionally contains both visuals in different places:

- hero: one real interactive TradingView panel immediately below the disclaimer;
- `#demo`: one local Vanguard Indicator image in its original product-demo position.

This is not a duplicate-chart violation: the local image demonstrates the Vanguard product interface, while the hero widget is the only interactive TradingView instance. Label both honestly and keep their purposes visually distinct.

If TradingView fails, show a neutral accessible loading/error state within the widget footprint. Do not substitute the Vanguard Indicator image into that footprint.

### TradingView configuration

Use TradingView's official Advanced Chart embed script:

```text
https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js
```

Use a deterministic initial symbol such as:

```text
OANDA:XAUUSD
```

Recommended configuration, adjusted only when the current official widget API requires it:

```js
{
  autosize: true,
  symbol: 'OANDA:XAUUSD',
  interval: '60',
  timezone: 'Etc/UTC',
  theme: activeTheme,
  style: '1',
  locale: supportedLocale,
  withdateranges: true,
  allow_symbol_change: true,
  save_image: false,
  calendar: false,
  hide_side_toolbar: false,
  hide_top_toolbar: false,
  support_host: 'https://www.tradingview.com'
}
```

Requirements:

- Confirm configuration names against the currently supported official widget format before implementation.
- Do not try to inject the private Vanguard indicator into the public embed.
- Do not claim the chart itself contains Vanguard signals.
- Do not add a market-data API or API key.
- Do not fabricate prices, profits, win rates, returns, or recommendations.
- Keep TradingView attribution visible and functional.
- Use `rel="noopener noreferrer nofollow"` for external attribution links when appropriate.
- The external Vanguard script link may remain available as a separate clearly labeled action if it is already approved by the repository.

### Loading, failure, and lifecycle

Create or restore a dedicated component, for example:

```text
src/components/tradingview-chart.js
```

The component must:

- initialize only when the widget section approaches the viewport;
- show a lightweight skeleton while loading;
- expose an accessible error state if TradingView is blocked or unavailable;
- preserve surrounding page content when the third-party script fails;
- avoid an infinite loading state;
- prevent duplicate initialization;
- clean up observers, timers, handlers, scripts, and widget DOM when destroyed;
- rebuild exactly once when a theme change requires a different TradingView theme;
- preserve the current page language, selected market category, selected instrument, and scroll position;
- keep only one script and iframe after repeated theme and language switching;
- work when `prefers-reduced-motion: reduce` is active;
- never block the rest of the landing page from rendering.

Do not repeatedly poll the DOM. Prefer a bounded timeout and iframe/load observation with complete cleanup.

### Bilingual surrounding content

All surrounding UI must use the current local translation architecture.

Arabic:

```text
الرسم التفاعلي للسوق
استكشف حركة الذهب مقابل الدولار مباشرة داخل الرسم التفاعلي من TradingView.
الرسم يعرض بيانات السوق من TradingView ولا يشكل توصية مالية أو ضماناً للنتائج.
جارٍ تحميل الرسم التفاعلي…
تعذر تحميل الرسم التفاعلي حالياً.
فتح مؤشر Vanguard على TradingView
```

English:

```text
Interactive Market Chart
Explore gold versus the US dollar directly in the interactive TradingView chart.
The chart displays market data from TradingView and is not financial advice or a guarantee of results.
Loading the interactive chart…
The interactive chart is currently unavailable.
Open Vanguard Indicator on TradingView
```

Use the site dictionaries and `data-i18n` system. Do not hard-code one language in component logic. Do not use `dangerouslySetInnerHTML` or construct HTML from translation strings.

## 4. Content Security Policy and third-party safety

The current CSP intentionally blocks TradingView because the widget was removed. Update it narrowly for the restored official widget.

Requirements:

- allow only the TradingView script origin required by the embed;
- allow only the TradingView frame origins actually required;
- allow image, font, style, and connection origins only when the widget genuinely needs them;
- preserve `object-src 'none'`, `base-uri 'self'`, secure form restrictions, and `upgrade-insecure-requests`;
- do not add a wildcard origin;
- do not add a broad `unsafe-inline` script allowance;
- do not weaken CSP beyond the verified widget requirements;
- update every relevant production HTML file consistently if the widget or shared CSP requires it;
- document the external dependency in `docs/security.md` if that document tracks third-party origins;
- update tests that currently assert `s3.tradingview.com` is absent;
- add positive assertions for the precise approved origins and negative assertions against wildcard or broad unsafe policies.

Mock the external widget script in Playwright. Automated tests must not depend on live TradingView availability.

## 5. Approved navbar design

Rebuild the current header as a premium floating capsule based on the approved mockup. Preserve Vanguard's restrained black, green, mint, and soft-white visual language. The supplied screenshot shows the current defect clearly: the primary pricing CTA is rendered once inside the intended header row and again on a second line below the navigation. Treat this as a structural responsive-state bug, not a spacing tweak.

### Remove all duplication first

Audit the header markup, responsive CSS, and navigation JavaScript before styling it. Remove duplicate desktop/mobile header fragments and repair breakpoint visibility.

The final desktop header must render exactly:

- one brand lockup;
- one primary navigation rail;
- one language control;
- one theme control;
- one `اختر باقتك` / `Choose Your Plan` CTA;
- no second CTA row beneath the navigation;
- no repeated navigation link;
- no duplicate logo or utility group;
- no empty element reserving a second navbar row.

Do not solve the screenshot defect by absolutely positioning the duplicate off-screen or hiding it with `opacity: 0`. Remove redundant markup when it serves no necessary responsive purpose. If separate desktop and mobile CTA elements are retained, they must have unique IDs, correct accessible names, and mutually exclusive breakpoint/display rules so only the correct one is visible and keyboard-focusable at any viewport. A hidden mobile control must use `display: none` or the `hidden` attribute, not remain in the accessibility tree.

### Critical logo rule

Do not redraw, reinterpret, approximate, generate, or replace the logo.

Use the existing official repository asset, preferably:

```text
public/assets/vanguard-logo.png
```

or the existing official SVG mark when it renders more sharply.

The brand lockup must show:

```text
Vanguard
Indicator
```

`Indicator` must appear directly beneath `Vanguard`, not beside it. Preserve the official logo's proportions, color, clear space, and aspect ratio. Do not use a triangular substitute or a newly generated V mark.

### Desktop layout

Build three visually balanced zones inside the navbar:

1. **Brand zone:** at the direction-appropriate inline start; on Arabic pages this appears on the right.
2. **Navigation zone:** a genuinely centered rounded navigation rail, independent of uneven side-zone widths.
3. **Utility zone:** language control, theme toggle, and primary pricing CTA grouped together; on Arabic pages this appears on the left.

Use CSS Grid or another stable layout so the central nav remains visually centered in the viewport/container, not merely centered in the leftover space.

The desktop navbar must remain a single horizontal row. Do not allow the navigation rail or CTA to wrap onto a second row. Switch to the mobile header before the three-zone layout becomes cramped.

Arabic navigation:

```text
المزايا
طريقة العمل
العرض
الأسئلة
```

English navigation:

```text
Features
How It Works
Demo
FAQ
```

Do not add `الباقات` or `Packages` as a normal navigation item. The pricing action already exists as the primary CTA:

```text
اختر باقتك
Choose Your Plan
```

### Navbar visual system

- Floating rounded outer shell with a thin Vanguard-green border.
- Dark near-black surface in dark mode with controlled transparency.
- Pale, readable surface in light mode.
- Maximum width aligned to the main page container.
- Comfortable inline padding without making the header excessively tall.
- Consistent control heights of approximately 44–48px.
- Center navigation inside its own subtle rounded rail.
- Active section shown by a mint pill or restrained highlight plus a small animated glow/line.
- Active state must not rely on color alone.
- Hover and focus must not shift item positions.
- One dominant mint pricing CTA with clear arrow direction for RTL/LTR.
- Subtle border and shadow; no excessive neon, blur, or glassmorphism.
- Maintain readable contrast in both themes.

### Language toggle

Upgrade the language control from a plain `EN` button to an accessible segmented toggle:

- show `AR` and `EN`;
- clearly show the active language;
- use one sliding indicator or a restrained crossfade;
- use `aria-pressed`, a radio-group pattern, or another correct accessible pattern;
- preserve language persistence;
- update `document.documentElement.lang` and `dir`;
- changing language must not reset the theme, market category, market instrument, FAQ state, or chart lifecycle unnecessarily.

### Theme toggle

Use the existing sun/moon icons and theme logic:

- display a sliding circular thumb between sun and moon states;
- animate only transform, opacity, border, and color;
- keep an accurate accessible name and `aria-pressed` state;
- preserve the stored theme;
- do not flash the wrong theme on first load;
- rebuild the TradingView widget only if its theme actually needs to change.

### Navbar motion

Use purposeful, restrained animation:

- 180–300ms transitions;
- active-section pill/underline glides between destinations;
- toggles slide smoothly;
- CTA has a subtle hover lift or arrow movement;
- the navbar becomes slightly more compact after scrolling without causing page jump;
- no bouncing, flashing, 3D rotation, or continuous distracting animation;
- no layout-affecting animation;
- respect `prefers-reduced-motion` by making state changes immediate or opacity-only.

### Sticky and scroll behavior

- Keep the header sticky.
- Reserve stable layout space so compact-on-scroll behavior does not shift content.
- Update the active navigation state with `IntersectionObserver` or the existing motion/navigation system.
- Do not create multiple observers for the same purpose.
- Clean up observers and listeners.
- Anchor navigation must account for sticky-header offset.
- Keep normal browser scrolling; no scroll-jacking or section snapping.

## 6. Mobile navbar

At widths where the desktop layout cannot remain readable, switch to a compact mobile header.

Requirements:

- official logo mark and stacked wordmark remain visible when space allows;
- language and theme controls remain reachable;
- accessible menu button with `aria-expanded`, `aria-controls`, and translated label;
- menu opens as a stable dropdown or drawer without horizontal overflow;
- menu contains Features, How It Works, Demo, FAQ, and the Choose Your Plan CTA;
- do not include Packages as a duplicate link;
- menu closes after activating a navigation destination;
- Escape closes the menu;
- focus moves logically into the menu and returns to the trigger on close;
- background scroll is locked only while a modal-style drawer is open;
- touch targets are at least approximately 44×44px;
- safe-area insets are respected;
- WhatsApp, scroll-to-top, and mobile CTA controls do not cover the menu or page content.
- only the compact header is visible; the desktop nav rail and desktop CTA are not visible or focusable;
- only one pricing CTA may be visible inside the open mobile menu; do not also show a second header CTA at the same breakpoint;
- the existing fixed `.mobile-action-bar` is a separate page action bar, not part of the navbar, and must never be accidentally cloned into the header.

Do not hide essential controls merely to make the header fit.

## 7. Landing-page typography and spacing audit

The site must not solve overlap by shrinking all text or hiding overflow. Fix the layout and typography system.

Audit every section in Arabic and English:

- navbar and mobile menu;
- hero eyebrow, title, three description paragraphs, buttons, trust list, and risk note;
- the spacing between the hero risk note and the interactive TradingView panel;
- benefits;
- workflow;
- the hero TradingView panel;
- the separate `#demo` product-image section;
- market explorer and all category/instrument states;
- bundle content;
- pricing;
- activation steps;
- FAQ;
- risk disclosure panel;
- final CTA;
- footer;
- floating controls;
- legal-page header/footer if shared styles are affected.

Rules:

- Keep headings and colored emphasis in normal document flow.
- Remove negative margins, persistent transforms, absolute text positioning, fixed text-box heights, and manual offsets that cause collision.
- Do not use `overflow: hidden` to conceal broken text.
- Use logical CSS properties for RTL/LTR.
- Use `clamp()` for responsive font sizes and spacing where useful.
- Use `text-wrap: balance` for headings and `text-wrap: pretty` for body copy where supported.
- Arabic body line-height should generally remain around `1.7–1.9`.
- English body line-height should generally remain around `1.55–1.75`.
- Avoid artificial Arabic letter spacing.
- Ensure paragraph groups have visible vertical gaps.
- Ensure title-to-description, description-to-actions, and section-to-section spacing is consistent.
- Cards and panels must grow with translated content.
- No fixed height may clip Arabic or English text.
- Do not let entrance animations finish with a transform that changes text geometry.
- No meaningful body copy should be smaller than 14px.
- Keep measure readable, generally no wider than about 65–72 characters for long paragraphs.
- Maintain WCAG AA text contrast.
- Prevent cumulative layout shift caused by late font, icon, navbar, or widget sizing.
- Ensure the added hero widget does not compress the risk note or remove the breathing room before the hero ticker/next section.

Preserve the current three-paragraph hero description and the existing visible financial-risk disclaimer. Do not introduce profit guarantees or language implying that Vanguard removes the need for judgment or risk management.

## 8. Responsive implementation

Test at minimum:

```text
1440 × 900
1280 × 800
1024 × 768
768 × 1024
430 × 932
390 × 844
360 × 800
```

Also test one short mobile viewport, such as `360 × 640`, to catch vertical crowding.

### Desktop

- Floating navbar remains aligned and centered.
- Brand, center navigation, and utilities never collide.
- TradingView panel has a useful height and clear separation after the risk note without overlapping the hero or dominating the page.
- The restored Vanguard Indicator image and demo copy remain visually balanced in `#demo`.
- Long English labels do not force the CTA outside the container.

### Tablet

- Switch from three-zone desktop navigation before content becomes cramped.
- The hero TradingView panel remains usable and does not overflow.
- The `#demo` image scales inside its figure without cropping translated captions.
- Multi-column sections stack or reduce columns naturally.

### Mobile

- No page-level horizontal scrolling.
- No clipped logo, toggle, heading, paragraph, button, chip, card, or iframe.
- Navbar controls remain usable at 360px.
- Mobile menu remains within the viewport.
- Widget height uses a mobile-friendly `clamp()` or aspect strategy.
- The chart iframe is not wider than its parent.
- The TradingView toolbar and attribution remain usable at 430px, 390px, and 360px.
- The restored Vanguard image uses `max-inline-size: 100%`/responsive sizing and does not cause horizontal overflow.
- Market chips and category cards wrap cleanly.
- Footer columns stack with clear gaps.
- Floating buttons do not cover interactive controls or final content.

Use automated overflow assertions at each required width. Check both `scrollWidth <= clientWidth` and real element bounding boxes; do not rely only on screenshots.

## 9. Theme and language preservation

Verify this full matrix:

| Language | Direction | Theme |
|---|---|---|
| Arabic | RTL | Dark |
| Arabic | RTL | Light |
| English | LTR | Dark |
| English | LTR | Light |

Changing one setting must not reset any other UI state.

Persist and preserve:

- language;
- theme;
- selected market category;
- selected market instrument;
- accessible navigation behavior.

The TradingView widget must visually match dark/light mode without duplicating itself. If changing language does not require a widget rebuild, do not rebuild it.

## 10. Accessibility

- Preserve the skip link and semantic landmarks.
- Keep one logical `h1` and correct heading order.
- Use visible `:focus-visible` styles.
- Use buttons for toggle actions and anchors for navigation.
- Maintain accurate accessible names in Arabic and English.
- Do not expose decorative animation to assistive technology.
- Give the TradingView section a descriptive heading and clarification.
- Keep status messages concise; do not create noisy live regions.
- Ensure navbar and menu keyboard order matches visual order in RTL and LTR.
- Test keyboard-only use of the navbar, menu, toggles, CTA, demo controls, market explorer, FAQ, and chart fallback link.
- Preserve reduced-motion behavior.
- Avoid focus loss when the widget or mobile menu rerenders.

## 11. Performance and code quality

- Use the existing architecture and dependencies.
- Do not add a large UI, animation, or carousel library.
- Keep translation data local and typed/structured consistently with the current project.
- Avoid duplicate state sources.
- Do not use `dangerouslySetInnerHTML`.
- Do not add secrets or environment files.
- Lazy-load the third-party widget so it does not block first paint.
- Reserve widget dimensions to avoid layout shift.
- Do not delay primary navigation or hero interactivity while TradingView loads.
- Keep animation on compositor-friendly properties.
- Clean up all event listeners, observers, timeouts, and external widget nodes.
- Preserve `/Vanguard/` paths and multi-page Vite output.
- Do not commit `dist`, `node_modules`, screenshots generated only for local QA, browser reports, or `.env` files.

## 12. Required tests

Update the existing Playwright tests rather than installing another framework.

Add or update tests for:

1. Arabic remains the default language.
2. English switching updates visible navigation and document `lang`/`dir`.
3. Theme and language persistence remain independent.
4. The official logo asset is used; `Indicator` is below `Vanguard` by layout/bounding-box assertion.
5. `Packages` / `الباقات` is absent from ordinary navbar links.
6. Exactly one navbar pricing CTA is visible and focusable on desktop; there is no second CTA row.
7. Exactly one navbar pricing CTA is visible inside the open mobile menu; desktop navbar actions are hidden and unfocusable.
8. Every visible Choose Your Plan CTA links to pricing.
9. Desktop navbar zones do not overlap at 1440, 1280, and 1024 widths.
10. Mobile navigation works at 430, 390, and 360 widths.
11. Escape closes the mobile menu and focus returns correctly.
12. Reduced-motion mode disables nonessential navbar movement.
13. Exactly one TradingView widget container exists.
14. The widget container is inside the first `.hero` section, follows `.risk-note` in DOM/visual order, and its top edge is below the disclaimer's bottom edge.
15. `#demo` contains `images/vanguard-indicator-preview.png` and contains no TradingView widget, loader, or iframe.
16. The official TradingView loader is requested only once per initialization.
17. Successful mocked loading produces exactly one iframe.
18. Repeated theme changes never leave more than one script or iframe.
19. Widget failure reveals the accessible fallback and does not break the page.
20. The widget configuration contains the approved symbol and no proprietary Vanguard study injection.
21. TradingView attribution remains visible.
22. CSP permits only the required TradingView origins and contains no wildcard/broad unsafe regression.
23. The Vanguard Indicator image remains a product demonstration and is never claimed to be live data.
24. No extra static market poster, demo video, or fake canvas appears as a second interactive market panel.
25. Hero text and every section heading/paragraph remain collision-free across the required viewport, language, and theme matrix.
26. No page-level horizontal overflow exists.
27. Market category and instrument interaction still passes.
28. FAQ, pricing, WhatsApp, scroll-to-top, and legal links still work.
29. No translation key appears visibly.
30. No uncaught exception, console error, CSP violation, or unexpected failed request occurs during normal mocked test operation.

When testing third-party loading, intercept the exact TradingView script URL and return a small deterministic mock that reads the configuration and inserts one test iframe. Keep a separate failure test that aborts the request.

## 13. Manual browser verification

After automated tests pass:

1. Run the local production preview under `/Vanguard/`.
2. Test the full language/theme matrix.
3. Test every required viewport.
4. Scroll through the entire landing page slowly.
5. Confirm navbar compact state and active-section state.
6. Open and close the mobile menu repeatedly.
7. Change language and theme repeatedly.
8. Confirm the risk disclaimer is followed immediately by exactly one interactive TradingView chart in the hero.
9. Confirm the Vanguard Indicator image is restored in `#demo` and the widget is absent from that section.
10. Interact with the chart when network access allows it.
11. Verify the fallback by blocking the TradingView script.
12. Confirm the navbar never shows a duplicated CTA, link rail, logo, or second row at any breakpoint.
13. Test every market category and instrument.
14. Check the browser console and network panel.
15. Confirm no text overlaps or is clipped.
16. Confirm no horizontal page scrolling.
17. Confirm floating controls do not cover content.
18. Confirm the official logo is unchanged.

Capture local screenshots for review if useful, but do not commit them unless the repository already expects those exact artifacts and they are part of the scoped change.

## 14. Commands and verification

Use the repository's real scripts. At minimum run:

```bash
npm ci
npm run build
npm run test:e2e
```

Also run formatter, linter, and type-check commands if they exist. Do not invent successful results for missing scripts; state that the command is not configured.

If a test fails, diagnose and fix the implementation. Do not delete meaningful assertions merely to make the suite pass. Update assertions that intentionally enforced the removed-widget state because the product requirement has changed.

## 15. Git safety, commit, and push to main

The user explicitly authorizes this scoped implementation to be committed and pushed directly to GitHub `main`.

Before committing:

1. Run `git status --short --branch`.
2. Confirm the active branch is `main`.
3. Confirm `origin` is `https://github.com/muataz94/Vanguard.git` or the authenticated equivalent.
4. Run `git fetch origin`.
5. Ensure local `main` is safely synchronized with `origin/main`.
6. Review the complete diff.
7. Confirm no unrelated files, secrets, generated `dist`, `node_modules`, or local test reports are staged.
8. Stage only files required for this task.

Use this commit message:

```text
feat: relocate TradingView panel and repair navbar
```

Push to:

```text
origin main
```

Do not:

- force push;
- use `git reset --hard`;
- bypass branch protection;
- overwrite unrelated changes;
- claim success if authentication, conflicts, checks, or branch rules block the push.

If `origin/main` changes during implementation, fetch and integrate safely, rerun relevant checks, then push. If a conflict cannot be resolved without risking unrelated work, stop and report the exact blocker.

## 16. Completion report

After pushing, report:

- concise summary of the visible result;
- exact TradingView component and confirmation that it sits immediately below the hero disclaimer;
- confirmation that only one interactive widget exists;
- confirmation that the Vanguard Indicator image is restored in `#demo` and unchanged;
- navbar architecture and responsive breakpoints;
- confirmation that no duplicate navbar/CTA instance is visible or focusable;
- confirmation that the original logo asset is unchanged and `Indicator` sits below `Vanguard`;
- typography/spacing fixes;
- accessibility behavior;
- CSP changes and approved TradingView origins;
- files changed;
- commands executed;
- automated test results;
- manual viewport/language/theme checks;
- build result;
- commit hash;
- push result;
- GitHub Actions/Pages deployment status and live URL if available;
- any remaining third-party-widget or browser limitation.

Do not report the task complete unless the implementation, tests, build, commit, and push have actually succeeded, or an exact external blocker has been documented.
