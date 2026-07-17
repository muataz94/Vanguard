# Vanguard repository guide

## Purpose

Arabic RTL landing page for Vanguard Indicator, a TradingView analysis aid. It must never promise profit, accuracy, risk-free trading, fixed returns, or recovery of losses.

## Structure

- `index.html`: landing page and SEO metadata.
- `privacy.html`, `terms.html`, `refund.html`, `risk-disclosure.html`: directly addressable legal pages.
- `src/config.js`: the only source of mutable contact, pricing, business, product, and deployment information.
- `src/components/`: pricing, FAQ, contact, animation, mobile CTA, and Three.js modules.
- `public/`: logo, favicon, social image, screenshots, robots, and sitemap.
- `.github/workflows/deploy-pages.yml`: GitHub Pages build and deployment.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run test:e2e
```

Use Node.js 22 or a compatible current LTS release. Run `npm run build` and relevant tests before committing.

## Non-negotiable rules

- Vite base path is `/Vanguard/`; preserve multi-page build inputs.
- Keep Arabic RTL, semantic landmarks, visible focus, skip link, reduced motion, keyboard navigation, accessible mobile focus trapping, and FAQ ARIA behavior.
- Brand colors: black `#000000`, green `#47b07b`, soft white `#f5faf7`.
- Do not invent testimonials, trading results, legal identity, refund terms, licensing, regulatory approval, or performance/Lighthouse results.
- Keep unresolved legal values visibly marked `[يجب الاستكمال قبل النشر]`.
- Do not hard-code contact details outside `src/config.js`.
- Keep WhatsApp messages anonymous to analytics; never send message content or personal data.
- Do not commit `dist`, `node_modules`, secrets, `.env` files, or local reports.
- Do not manually deploy `dist`; GitHub Actions owns Pages deployment.
