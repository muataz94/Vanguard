# Vanguard Indicator landing page

Professional Arabic RTL landing page for **Vanguard Indicator — مؤشر فانگارد**, a TradingView analysis aid. The site is static: it has no backend, account system, card collection, recurring billing, or simulated checkout.

Live site: <https://muataz94.github.io/Vanguard/>

## Stack

- Vite and vanilla JavaScript modules
- RTL CSS with Alexandria and Fustat typography
- GSAP and ScrollTrigger for restrained section motion
- Three.js desktop hero visual with static mobile/reduced-motion fallback
- Lucide icons
- Playwright browser tests
- GitHub Pages deployment through Actions

Use Node.js 22 or a compatible current LTS release.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run test:e2e
```

The Vite base is `/Vanguard/`. `dist` is generated and ignored; GitHub Actions owns deployment.

## Configuration

Edit mutable contact, pricing, business, product, and deployment data only in `src/config.js`.

- WhatsApp number: international digits without `+`, spaces, or punctuation.
- Pricing: labels, durations, prices, and availability.
- Business identity and support email: currently unresolved and therefore not rendered as raw placeholders.
- Evidence and testimonials: disabled until real, permission-based content exists.
- Analytics: disabled by default and limited to anonymous interaction events when enabled.

The visual source of truth is `public/assets/vanguard-logo.png`. Do not distort, recolor, crop, or replace its identity.

## Current commercial safeguards

- WhatsApp links use `9647717220578` and package-specific Arabic messages.
- The one-month plan is available and opens a prefilled WhatsApp activation request.
- The six-month USD 450 price requires owner review because two three-month plans currently cost less.
- Development warnings are emitted only in development and never displayed as public card content.
- The site does not request or collect payment-card information.

## Motion architecture

Normal browser scrolling is preserved. One Three.js renderer powers the abstract Vanguard form in the visual-demo section. GSAP registers ScrollTrigger for one-time, class-driven section reveals; CSS performs the restrained transitions without CSP-blocked inline styles. There is no pinning, snapping, scroll-jacking, or readable-content overlay. Reduced-motion mode skips Three.js and shows the static CSS Vanguard form immediately.

See [docs/motion-architecture.md](docs/motion-architecture.md) for implementation details and [docs/motion-revamp-audit.md](docs/motion-revamp-audit.md) for the baseline audit.

Static-host security controls and GitHub Pages limitations are documented in [docs/security.md](docs/security.md).

## Browser evidence

The Playwright suite covers the required desktop, tablet, and phone viewports; reverse scrolling; reduced motion; keyboard operation; direct legal routes; WhatsApp URLs; asset failures; console errors; horizontal overflow; and scroll long tasks. It also creates:

- `artifacts/revamp-desktop-top.png`
- `artifacts/revamp-desktop-middle.png`
- `artifacts/revamp-desktop-pricing.png`
- `artifacts/revamp-mobile-top.png`
- `artifacts/revamp-mobile-pricing.png`
- `artifacts/revamp-scroll-test.webm`

Local screenshots and automated checks are implementation evidence only; they are not performance guarantees for every device, network, browser, or deployed response.

## Legal and owner inputs

Direct pages exist for privacy, terms, refund information, and risk disclosure. They do not invent legal identity or expose developer bracket tokens. Before commercial launch, the owner still needs to provide or approve:

- Legal business name and physical address
- Support email
- Final prices, especially the six-month plan
- Final refund terms and applicable-law review
- Verified product behavior before making any non-repainting claim
- Confirmed supported-market and account-access rules
- Real balanced examples with permission and context before enabling evidence
- A real demonstration video if one will replace the visual simulation
- Permission-based testimonials before enabling testimonials

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds and deploys `dist` whenever `main` is pushed. Pages must be configured once under **Settings → Pages → Build and deployment → GitHub Actions**. Do not commit or manually publish `dist`.

## Compliance

Vanguard is described only as an analytical aid. Do not add guaranteed-profit language, fabricated results, fake urgency, unapproved testimonials, regulatory claims, fixed returns, risk-free language, or guarantees of advertising approval. The visible capital-loss disclosure must remain.
