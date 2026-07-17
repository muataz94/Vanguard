# Vanguard Indicator landing page

Production-oriented Arabic RTL landing page for **Vanguard Indicator — مؤشر فانگارد**, a TradingView analysis aid. The site is static: it has no backend, accounts, card collection, recurring billing, or fake checkout.

Live URL: <https://muataz94.github.io/Vanguard/>

## Technology

- Vite and vanilla JavaScript ES modules
- Modern RTL CSS
- Three.js hero visual with CSS and reduced-motion fallbacks
- GSAP and ScrollTrigger
- Lucide icons
- Playwright browser tests
- GitHub Pages deployment through GitHub Actions

Node.js 22 is used in CI. Use Node.js 22 or a compatible current LTS release locally.

## Local setup

```bash
npm install
npm run dev
npm run build
npm run preview
```

Run the automated browser suite with:

```bash
npm run test:e2e
```

Vite serves the project under `/Vanguard/`. The production build is written to the ignored `dist` directory.

## Configuration

Edit mutable business information only in `src/config.js`:

- `contact.whatsappNumber`: international digits without `+`, spaces, or punctuation.
- `contact.defaultMessage` and support email.
- `business.legalName` and `business.physicalAddress`.
- `pricing`: labels, durations, prices, availability, and review flags.
- `product`: verified product claims and optional sections.
- `media.youtubeVideoId`: real demonstration video when available.
- `analytics`: disabled by default and limited to anonymous interaction events.

The supplied logo source of truth is `public/assets/vanguard-logo.png`. Do not distort, recolor, rotate, crop, or replace its identity.

## WhatsApp and pricing

WhatsApp URLs and package-specific Arabic messages are generated from `src/config.js`. A valid number is required before a click-to-chat link is created. Enabled plans include their configured name, duration, and price in the prefilled message. The site never collects payment-card information.

The six-month price is deliberately flagged for owner review because two three-month subscriptions currently cost less. The one-month plan is disabled by configuration. Do not remove these safeguards without confirmed commercial terms.

## Legal and owner-supplied content

Direct static pages exist for privacy, terms, refund policy, and risk disclosure. Values marked `[يجب الاستكمال قبل النشر]` are factual placeholders and must not be presented as finalized legal information.

Before commercial launch, the owner must provide or confirm:

- Legal business name and physical address
- Real support email
- Final pricing and refund policy
- Verified balanced screenshots and their context
- Non-repainting behavior, if it will be claimed
- Supported markets and activation rules
- Actual demonstration video
- Permission-based testimonials before enabling that section

## GitHub Pages deployment

The repository is deployed by `.github/workflows/deploy-pages.yml` whenever `main` is pushed. The workflow:

1. Checks out the repository.
2. Installs Node.js 22 and runs `npm ci`.
3. Builds the Vite multi-page site.
4. Uploads `dist` as a Pages artifact.
5. Deploys the artifact to GitHub Pages.

Repository setting required once:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.

Do not commit or manually publish `dist`.

## SEO and routing

- Vite base: `/Vanguard/`
- Canonical production origin: `https://muataz94.github.io/Vanguard/`
- Static legal pages are included as Rollup inputs for direct loading.
- `robots.txt`, `sitemap.xml`, favicon, logo, Open Graph image, and HTML assets use Pages-compatible paths.

## Accessibility checklist

- Arabic `lang` and RTL direction
- Semantic landmarks and one page-level `h1`
- Focus-visible skip link and controls
- Mobile-menu focus trap, Escape handling, and focus restoration
- Accessible FAQ accordion semantics
- Touch-friendly controls and logical reading order
- Reduced-motion fallback and nonessential canvas suppression
- Tooltips supplement visible content; essential information is never hover-only
- Verify keyboard navigation and 200% zoom after content changes

## Performance checklist

- Three.js is dynamically imported after critical content and browser idle time
- Canvas pixel ratio is capped and rendering pauses when hidden/offscreen
- Below-the-fold images are lazy-loaded with explicit dimensions
- No external 3D models, large textures, autoplay media, or heavy UI framework
- Scroll handlers are passive/frame-throttled
- Run Lighthouse before reporting any score; do not invent results

## Troubleshooting

- Blank assets on Pages: confirm `base: '/Vanguard/'` and keep public assets and internal static-page links under `/Vanguard/`.
- Legal page missing from `dist`: preserve its entry in `vite.config.js` under `build.rollupOptions.input`.
- WhatsApp disabled: check `contact.whatsappNumber` contains 10–15 digits.
- Stale local styles: stop the old Vite process, restart `npm run dev`, and hard-refresh once.
- Pages workflow fails: inspect the Actions log and confirm Pages source is set to GitHub Actions.

## Compliance

This product is described only as an analytical aid. Do not add guaranteed-profit language, fabricated results, fake urgency, testimonials without permission, regulatory claims, or claims of guaranteed advertising approval. Trading risk and the possibility of capital loss must remain visible.
