# Vanguard Indicator Landing Page — Master Build Prompt

## Role

Act as a senior product designer, conversion-focused Arabic UX writer, front-end engineer, performance engineer, accessibility specialist, SEO specialist, and deployment engineer.

Build a production-ready, mobile-first, RTL Arabic landing page for a TradingView analytical indicator named **Vanguard Indicator — مؤشر فانگارد**.

The project will be developed locally in **Visual Studio Code** and deployed as a static website using **GitHub + Cloudflare Pages**, with no paid services required for the initial release.

Do not merely create a mockup. Generate the full working project, test it, optimize it, and provide exact deployment instructions.

---

## Critical commercial and compliance constraint

This is a financial-analysis product, not a guaranteed-profit system.

Never write or visually imply:

- Guaranteed profit.
- Guaranteed winning signals.
- 100% accuracy.
- Risk-free trading.
- Automatic wealth.
- Fixed financial returns.
- “You cannot lose.”
- False scarcity, fake countdowns, fake user counts, or fabricated testimonials.

Use careful wording such as:

- “أداة تحليلية مساعدة”
- “إشارات واضحة وفق إعدادات المؤشر”
- “يساعد على تقليل وقت التحليل”
- “النتائج السابقة لا تضمن النتائج المستقبلية”
- “التداول ينطوي على مخاطر وقد يؤدي إلى خسارة رأس المال”

The full risk warning must be visibly rendered on the page and must not be hidden behind a modal, tooltip, accordion, hover state, or external link.

Do not claim that Google Ads or YouTube Ads approval is guaranteed. The website must be transparent and policy-conscious, but final approval depends on the advertising platform, targeted jurisdiction, licensing status, and the advertiser account.

---

## Product information

### Product name

**مؤشر فانگارد — Vanguard Indicator**

### Core positioning

A TradingView analytical indicator designed to help traders read market opportunities through clear visual signals, alerts, and structured entry/exit areas without spending excessive time performing manual chart analysis.

### Intended audience

Arabic-speaking users interested in:

- Forex.
- Cryptocurrencies.
- Stocks.
- Market indices.
- Short-term trading.
- Intraday trading.
- Swing trading.

### Main benefits to communicate

1. Clear visual entry and exit zones.
2. Fixed signals that do not redraw or repaint after appearing, only if this statement is technically verified by the product owner.
3. Immediate alert support on mobile through TradingView.
4. Reduced manual chart-monitoring time.
5. Support for several markets and trading styles.
6. A structured interface intended to reduce emotional decision-making.
7. Simple setup and activation process.

### Package contents

The main subscription package includes:

- Vanguard main indicator.
- Smart Money Concept indicator as a bonus.
- Additional confirmation indicator as a second bonus.
- Setup instructions.
- Activation guidance.
- Support channel.
- Updates, only if the product owner confirms they are included.

### Current pricing data

Render prices through a centralized JavaScript configuration object so they can be changed without editing markup.

Initial values:

- One month: USD 95 — disabled and marked “غير متاح حالياً”.
- Three months: USD 199 — available.
- Six months: USD 450 — available but display an internal developer warning because this price is commercially inconsistent: two three-month plans cost USD 398.
- Annual: USD 795 — available and labeled “أفضل قيمة” only after comparing its monthly price accurately.

Add a clear `TODO` comment requesting final confirmation of all prices before production deployment.

Do not create automated recurring billing in version one.

---

## Recommended technology stack

Use:

- Vite.
- Vanilla JavaScript with ES modules.
- Semantic HTML5.
- Modern CSS with custom properties.
- Three.js for lightweight 3D visuals.
- GSAP core.
- GSAP ScrollTrigger.
- Lucide icons or inline SVG icons.
- No React unless a genuine technical requirement appears.
- No backend.
- No database.
- No paid UI kits.
- No paid fonts.
- No paid assets.
- No unnecessary dependencies.

Use npm packages only from reputable official sources.

Install:

```bash
npm create vite@latest vanguard-landing -- --template vanilla
cd vanguard-landing
npm install
npm install three gsap lucide
npm run dev
```

Use the package name supported by the current Lucide setup. If `lucide` is not correct in the current ecosystem, use the officially documented vanilla package and update the import accordingly.

---

## Project output requirements

Create the full project with at least this structure:

```text
vanguard-landing/
├─ index.html
├─ package.json
├─ vite.config.js
├─ README.md
├─ .gitignore
├─ public/
│  ├─ favicon.svg
│  ├─ og-image-placeholder.webp
│  ├─ assets/
│  │  ├─ vanguard-logo.png
│  │  ├─ vanguard-logo-transparent.png
│  │  └─ vanguard-logo-mark.svg
│  ├─ screenshots/
│  │  ├─ signal-example-01-placeholder.webp
│  │  ├─ signal-example-02-placeholder.webp
│  │  └─ signal-example-03-placeholder.webp
│  └─ videos/
│     └─ demo-placeholder.txt
└─ src/
   ├─ main.js
   ├─ styles.css
   ├─ config.js
   ├─ content.js
   ├─ analytics.js
   ├─ components/
   │  ├─ three-scene.js
   │  ├─ animations.js
   │  ├─ pricing.js
   │  ├─ faq.js
   │  ├─ mobile-cta.js
   │  └─ contact.js
   └─ assets/
      └─ logo-mark.svg
```

The site must run successfully with:

```bash
npm install
npm run dev
npm run build
npm run preview
```

The production output must be generated in `dist`.

---


## Supplied logo and mandatory brand palette

Use the supplied Vanguard logo as the primary visual source for the entire landing page.

The uploaded source logo is a square raster image with:

- Black background.
- A bold geometric “V” mark.
- Primary green shape.
- Off-white secondary shape.
- High-contrast, minimal fintech appearance.

### Extracted core colors

Use these exact core colors as CSS variables:

```css
:root {
  --brand-black: #000000;
  --brand-green: #47b07b;
  --brand-white: #f5faf7;
}
```

The dominant colors were extracted from the supplied logo:

- **Brand Black:** `#000000`
- **Vanguard Green:** `#47B07B`
- **Soft White:** `#F5FAF7`

Do not replace the green with neon green, lime, blue, gold, or generic cryptocurrency colors.

### Supporting tonal system

Create supporting tones derived from the logo without changing its identity:

```css
:root {
  --brand-black: #000000;
  --brand-green: #47b07b;
  --brand-white: #f5faf7;

  --surface-950: #050706;
  --surface-900: #0b0f0d;
  --surface-850: #101713;
  --surface-800: #162019;

  --green-700: #2d7451;
  --green-600: #399566;
  --green-500: #47b07b;
  --green-400: #68c895;
  --green-300: #91d9b4;
  --green-100: #dff5e9;

  --text-primary: #f5faf7;
  --text-secondary: #b9c8c0;
  --text-muted: #829289;

  --border-subtle: rgba(245, 250, 247, 0.12);
  --border-green: rgba(71, 176, 123, 0.35);
  --glow-green: rgba(71, 176, 123, 0.24);

  --danger: #ef6b73;
  --warning: #e2b85b;
}
```

The red and amber colors are functional status colors only. They must never become major brand colors.

### Usage ratios

Apply the palette approximately as follows:

- 65–75% black and very dark surfaces.
- 15–20% soft white text and light surfaces.
- 8–12% Vanguard green for CTAs, highlights, active states, lines, icons, and 3D lighting.
- Less than 3% warning or risk colors.

### Logo usage rules

- Copy the supplied logo into `public/assets/vanguard-logo.png`.
- Do not stretch, skew, recolor, rotate, crop, or apply perspective to the logo.
- Preserve its square aspect ratio.
- Use it in the header, footer, favicon source, Open Graph artwork, and loading fallback where appropriate.
- Header logo size should be approximately 40–48 px on desktop and 34–40 px on mobile.
- Provide at least 12% of the logo width as clear space around it.
- Do not place the logo directly over busy chart imagery.
- Because the supplied file has a black background, display it on black or near-black surfaces.
- Create a transparent-background version only if image editing is performed carefully and the mark remains visually identical.
- If a clean vector recreation is made, verify it against the original before using it.
- Add meaningful alt text when the logo conveys the brand:
  `شعار مؤشر فانگارد`
- Use an empty alt attribute when the same adjacent text already identifies the brand and the image is decorative.

### Brand design language

Every component should visually relate to the logo:

- Strong diagonal cuts and V-shaped geometry.
- Rounded corners should be moderate, not excessively soft.
- Use angled masks, clipped borders, and subtle V motifs.
- Use green diagonal accent lines inspired by the upper arms of the logo.
- Use off-white panels only for deliberate contrast.
- Keep the overall look sharp, technical, premium, and controlled.
- Avoid generic blue fintech styling.
- Avoid purple gradients.
- Avoid gold luxury styling.
- Avoid excessive glassmorphism.
- Avoid glowing green text everywhere.
- Avoid placing green on green where contrast becomes weak.

### Component color mapping

Use the palette consistently:

- Page background: `--brand-black` or `--surface-950`.
- Header background: translucent `--surface-900`.
- Primary text: `--brand-white`.
- Secondary text: `--text-secondary`.
- Primary CTA: `--brand-green` with dark text.
- CTA hover: `--green-400`.
- Secondary CTA: transparent with `--border-green`.
- Cards: `--surface-900` or `--surface-850`.
- Card borders: `--border-subtle`.
- Active navigation: `--brand-green`.
- Pricing highlight: green border and restrained glow.
- Risk panel: dark surface with a small warning accent.
- WhatsApp button: use official WhatsApp green only for the WhatsApp control; keep the rest of the page on the Vanguard palette.
- 3D scene lighting: black, off-white, and Vanguard green only.

### Contrast requirements

- Do not use Vanguard green for long body text on black.
- Use off-white for paragraph text.
- Ensure button text has WCAG AA contrast.
- Test green buttons with near-black text.
- Do not rely on green alone to communicate success, selection, or availability.
- Add text, icon, or pattern indicators alongside color.

---

## Visual concept

Create a premium fintech visual identity rather than a generic crypto template.

### Direction

- RTL Arabic layout.
- Use the supplied logo as the source of truth.
- Black and near-black backgrounds.
- Vanguard green `#47B07B` as the primary action and accent color.
- Soft white `#F5FAF7` for main text and selected light surfaces.
- Deep green supporting tones derived from the logo.
- Diagonal V-inspired geometry.
- Subtle chart-grid lines.
- Restrained green glow.
- Strong contrast.
- Clear typography.
- Large spacing.
- No visual clutter.
- No casino aesthetic.
- No gold coins, luxury cars, cash piles, rockets, or “get rich” imagery.
- No generic purple or blue crypto gradients.
- No copied TradingView branding or proprietary interface assets.

### Typography

Use a free Arabic web-safe or Google Font with good Arabic rendering, such as:

- IBM Plex Sans Arabic.
- Noto Kufi Arabic.
- Noto Sans Arabic.
- Tajawal.

Use a reliable system-font fallback.

Keep font loading efficient and avoid excessive weights.

---

## 3D animated hero scene

Create a lightweight Three.js scene in the hero section.

### Scene concept

Use abstract financial-analysis geometry rather than literal money imagery:

- A central translucent 3D ring or torus.
- Floating nodes.
- Thin connecting lines.
- Small candlestick-inspired bars.
- A subtle waveform or data ribbon.
- Slowly rotating geometric shapes.
- Soft depth and parallax.
- A gentle pointer-based response on desktop.
- A restrained device-orientation-independent animation on mobile.
- No external 3D model download is required.

### Animation rules

- The animation must support the message, not distract from it.
- Cap device pixel ratio to protect mobile performance.
- Pause or heavily reduce rendering when the tab is hidden.
- Resize cleanly.
- Dispose of Three.js resources when appropriate.
- Use one animation loop only.
- Avoid heavy post-processing.
- Avoid large textures.
- Avoid physics engines.
- Do not block the hero headline from rendering.
- Render the textual hero content immediately, independently of the canvas.
- On low-power devices or unsupported browsers, provide a static CSS gradient fallback.
- Respect `prefers-reduced-motion`.
- Disable pointer parallax on touch devices.
- Set the Three.js canvas to `aria-hidden="true"` and keep it out of keyboard navigation.

### GSAP animations

Use GSAP and ScrollTrigger for:

- Hero text entrance.
- Benefit-card reveal.
- Section-title reveal.
- Pricing-card stagger.
- Evidence-card reveal.
- FAQ expansion transitions.
- Final CTA entrance.

Do not animate every element.

All animation must degrade safely when JavaScript is disabled or reduced motion is requested.

---

## Required page sections

### 1. Accessibility skip link

Add a visible-on-focus skip link:

```text
انتقل إلى المحتوى الرئيسي
```

### 2. Header

Include:

- Vanguard logo mark.
- Text logo: “Vanguard Indicator”.
- Anchor navigation:
  - المزايا
  - كيف يعمل
  - الباقات
  - النتائج
  - الأسئلة الشائعة
- Primary CTA: “احصل على المؤشر”.
- Mobile navigation drawer.
- Sticky header with subtle background blur.
- Proper ARIA labels and focus management.

### 3. Hero

Arabic headline concept:

```text
حلّل السوق بوضوح أكبر، واتخذ قراراتك بانضباط
```

Supporting copy:

```text
مؤشر تحليلي لمنصة TradingView يساعدك على قراءة مناطق الدخول والخروج، متابعة الإشارات، واستلام التنبيهات على هاتفك ضمن تجربة واضحة وسهلة الاستخدام.
```

Include:

- Primary CTA: “احصل على المؤشر الآن”.
- Secondary CTA: “شاهد طريقة العمل”.
- Three short trust points:
  - يعمل على TradingView.
  - يدعم تنبيهات الهاتف.
  - إعداد واستخدام مبسّطان.
- Short visible risk statement.
- 3D scene.
- A small simulated signal panel built with HTML/CSS, clearly labeled as a visual demonstration rather than live market data.

Never display fabricated live prices.

### 4. Problem section

Headline:

```text
هل يستهلك التحليل اليدوي وقتك وتركيزك؟
```

Cover:

- Long hours watching charts.
- Inconsistent decision-making.
- Emotional entries.
- Missed opportunities.
- Difficulty managing multiple markets.

Do not exaggerate fear.

### 5. Solution section

Explain how Vanguard supports a more structured workflow:

1. Add the indicator to TradingView.
2. Select the market and timeframe.
3. Review the visual signal and confirmation conditions.
4. Receive alerts when configured conditions occur.
5. Apply personal risk management before any trade.

Show this as an animated five-step timeline.

### 6. Benefits grid

Create six cards:

- إشارات مرئية واضحة.
- مناطق دخول وخروج منظمة.
- تنبيهات فورية.
- دعم أسواق متعددة.
- تقليل وقت المراقبة اليدوية.
- تجربة متوافقة مع الهاتف.

Each card must have:

- Accessible SVG icon.
- Brief title.
- One short paragraph.
- No unrealistic performance claim.

### 7. Product demonstration

Add a responsive video section.

Initially support either:

- A privacy-enhanced YouTube embed loaded only after user interaction.
- A locally hosted compressed MP4 added later.

Until a real video exists, show a polished placeholder with:

- Play button.
- “سيتم إضافة الفيديو التعريفي هنا”.
- A TODO comment explaining where to configure the video ID.

Do not autoplay video with sound.

### 8. Package contents

Display:

- Vanguard Indicator.
- Smart Money Concept bonus.
- Confirmation indicator bonus.
- Setup guide.
- Activation support.
- Updates, conditionally controlled through configuration.

Use a premium bundle card with a layered 3D CSS presentation.

### 9. Markets and compatibility

Display supported categories as configurable items:

- Forex.
- Crypto.
- Stocks.
- Indices.

Add a disclaimer:

```text
قد تختلف كفاءة الإعدادات حسب الأصل المالي، الإطار الزمني، ظروف السوق وطريقة إدارة المخاطر.
```

Do not state compatibility unless verified.

### 10. Evidence and examples

Create a section for genuine, user-supplied chart screenshots.

Each result card must support:

- Screenshot.
- Instrument.
- Timeframe.
- Date.
- Setup description.
- Outcome.
- Optional loss/win label.
- A clear note that it is a historical example.
- No “proof” language.

Use placeholders until real evidence is supplied.

Include at least one neutral or losing-example placeholder so the design does not structurally encourage cherry-picking.

Add:

```text
الأمثلة المعروضة لأغراض توضيحية وتعليمية، ولا تمثل وعداً بتحقيق نتائج مماثلة.
```

### 11. Testimonials

Do not invent customers.

Create three visually complete placeholder cards clearly labeled:

```text
شهادة عميل موثقة — بانتظار المحتوى
```

Hide the testimonial section in production by default using configuration:

```js
showTestimonials: false
```

Only enable it when genuine, permission-based testimonials are provided.

### 12. Pricing

Generate pricing cards dynamically from `src/config.js`.

Each card must show:

- Plan name.
- Duration.
- Total price.
- Calculated monthly equivalent.
- Availability.
- Feature list.
- CTA button.
- “أفضل قيمة” only when supported by the calculation.

For the disabled monthly plan:

- Disable the CTA.
- Show “غير متاح حالياً”.
- Ensure keyboard and screen-reader behavior is correct.

For available plans, the CTA should open a configurable WhatsApp contact URL with a prefilled Arabic message containing the selected plan.

Use placeholders in configuration:

```js
whatsappNumber: "964XXXXXXXXXX"
telegramUsername: ""
```

Do not hard-code a personal number in multiple files.

Do not imply the checkout is automated.

### 13. FAQ

Build an accessible accordion using real `<button>` controls with `aria-expanded` and `aria-controls`.

Questions:

1. هل يضمن المؤشر الربح؟
2. هل يعمل على الهاتف؟
3. هل يعيد رسم الإشارات؟
4. هل أحتاج إلى اشتراك TradingView مدفوع؟
5. ما الأسواق التي يدعمها؟
6. كيف يتم تفعيل المؤشر؟
7. هل توجد سياسة استرجاع؟
8. هل التحديثات مشمولة؟
9. هل يمكن استخدامه على أكثر من حساب؟
10. كيف أتواصل مع الدعم؟

Answers must be configurable and must not invent unresolved commercial terms. For undefined items, clearly say that the seller must configure the policy before publishing.

### 14. Risk disclosure

Render a prominent risk panel before the final CTA:

```text
تنبيه مخاطر مهم

التداول في الأسواق المالية ينطوي على مخاطر مرتفعة وقد يؤدي إلى خسارة جزء أو كامل رأس المال. مؤشر فانگارد أداة تحليلية مساعدة ولا يقدم ضماناً للربح، ولا تشكل إشاراته نصيحة استثمارية شخصية. النتائج السابقة لا تضمن النتائج المستقبلية. يتحمل المستخدم المسؤولية الكاملة عن قراراته وإدارة رأس ماله.
```

Keep it visible without requiring interaction.

### 15. Final CTA

Headline:

```text
ابدأ بتجربة تحليل أكثر وضوحاً وتنظيماً
```

Buttons:

- “اختر باقتك”.
- “تواصل معنا”.

Add no fake urgency.

### 16. Footer

Include:

- Logo.
- Brief product description.
- Contact links.
- Privacy Policy.
- Terms and Conditions.
- Refund Policy.
- Risk Disclosure.
- Copyright with current year.
- Business name placeholder.
- Physical business address placeholder.
- Email placeholder.

The business identity and physical address must be configured before running financial-product advertisements.

Create the legal content either as:

- Accessible modal dialogs with full keyboard support, or preferably
- Separate static HTML pages:
  - `/privacy.html`
  - `/terms.html`
  - `/refund.html`
  - `/risk-disclosure.html`

Prefer separate pages because they are easier to link, index, review, and share.

Do not write fake legal details. Use clear `[يجب الاستكمال قبل النشر]` placeholders where owner information is missing.

---

## Arabic content style

Write in clear Modern Standard Arabic suitable for an Iraqi and wider Arabic-speaking audience.

Requirements:

- Avoid slang in primary sales copy.
- Keep sentences short.
- Avoid excessive English terminology.
- Where English technical names are necessary, pair them with Arabic.
- Do not overuse exclamation marks.
- Do not use manipulative copy.
- Do not call the product “ذكاء اصطناعي” unless it genuinely uses AI.
- Do not describe the indicator as “licensed” or “regulated” without proof.

---

## Conversion design

Use ethical conversion principles:

- Primary CTA repeated after key decision sections.
- Sticky bottom CTA on mobile.
- Strong visual hierarchy.
- Clear price and fees.
- Transparent activation process.
- Transparent risk statement.
- Real evidence only.
- No dark patterns.
- No preselected consent checkboxes.
- No fake chat notification.
- No fake scarcity.
- No fake counters.
- No exit-intent popup in version one.

Track CTA clicks without collecting personally identifiable information.

---

## Accessibility requirements

Target WCAG 2.2 AA good practices.

Implement:

- Semantic landmarks.
- One `<h1>`.
- Logical heading structure.
- Keyboard navigation.
- Visible focus states.
- Minimum practical touch target sizes.
- Sufficient contrast.
- Meaningful alternative text.
- Decorative images with empty alt text.
- `aria-hidden` for decorative 3D canvas.
- Proper accordion semantics.
- Mobile-menu focus trap and Escape handling.
- No content available only through hover.
- Reduced-motion mode.
- No flashing effects.
- Form labels, not placeholders alone.
- Error messages connected with ARIA when a form is present.

Test the page manually using keyboard only.

---

## Performance requirements

The mobile landing page must remain fast despite 3D animation.

Implement:

- Mobile-first CSS.
- Lazy loading below-the-fold images.
- Width and height attributes to avoid layout shift.
- WebP or AVIF placeholders.
- Dynamic import of the Three.js module after critical content loads.
- Do not delay hero HTML for the 3D scene.
- Limit the number of GSAP ScrollTriggers.
- Use transform and opacity for animation.
- Use passive pointer/scroll listeners when appropriate.
- Avoid enormous DOM trees.
- Minify through Vite.
- Use system or efficiently loaded fonts.
- Preload only genuinely critical assets.
- Use responsive images.
- Cap canvas resolution.
- Stop animation when not visible if feasible.
- Avoid animation on weak devices based on capability checks.
- Provide a CSS-only fallback.

Performance budgets:

- Initial compressed JavaScript target: under 250 KB where practical.
- Hero image or fallback visual: under 200 KB.
- Each screenshot: under 250 KB.
- No single static asset larger than necessary.
- No cumulative layout movement from media.
- Aim for strong Lighthouse results, without claiming a score before testing.

Add a README checklist for Lighthouse testing.

---

## SEO requirements

Implement:

- Arabic `lang="ar"` and `dir="rtl"`.
- Unique title.
- Meta description.
- Canonical URL placeholder.
- Open Graph metadata.
- Twitter/X card metadata.
- Favicon.
- Theme color.
- Robots meta.
- Descriptive anchor labels.
- Structured data using JSON-LD only where factually valid.

Recommended title:

```text
مؤشر فانگارد | أداة تحليل وتنبيهات لمنصة TradingView
```

Recommended description:

```text
تعرّف على مؤشر فانگارد، أداة تحليلية لمنصة TradingView تساعد على تنظيم قراءة الإشارات، مناطق الدخول والخروج، والتنبيهات على الهاتف.
```

Do not add fake aggregate ratings, fake reviews, or unsupported Product schema fields.

Create `robots.txt` and `sitemap.xml` with a placeholder production domain.

---

## Privacy and analytics

Use Cloudflare Web Analytics as the recommended zero-cost analytics option.

Implement analytics in a separate module so it can be disabled.

Track only anonymous events such as:

- `cta_click`
- `pricing_plan_click`
- `video_play`
- `faq_open`
- `whatsapp_click`

Do not send:

- Phone numbers.
- Names.
- Email addresses.
- TradingView usernames.
- Message contents.
- Financial details.

Do not load Google Analytics by default.

Create configuration:

```js
analytics: {
  enabled: false,
  provider: "cloudflare",
  token: ""
}
```

---


## WhatsApp floating contact button

Add a persistent WhatsApp contact button to every public page.

### Configuration

Keep the contact number and message in `src/config.js`:

```js
contact: {
  whatsappNumber: "9647XXXXXXXXX",
  defaultMessage:
    "مرحباً، أرغب بالاستفسار عن مؤشر فانگارد والباقات المتاحة."
}
```

Rules:

- Use international format without `+`, spaces, punctuation, or a leading local zero.
- Example Iraqi format: `9647701234567`.
- Do not hard-code the number in HTML, CSS, or multiple JavaScript files.
- Validate that the configured value contains digits only before generating the URL.
- If the placeholder number has not been replaced, disable the control and log a clear development warning rather than opening a broken link.

### URL generation

Use the official click-to-chat format:

```js
function createWhatsAppUrl(message) {
  const number = siteConfig.contact.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
```

### Floating-button requirements

- Show a circular or compact pill-shaped button on desktop.
- Use the official WhatsApp icon.
- Use official WhatsApp green for this control only.
- Position it using logical CSS properties.
- Place it at the lower inline-end side.
- Keep sufficient distance from the viewport edges.
- Add `aria-label="تواصل معنا عبر واتساب"`.
- Open in a new tab with `rel="noopener noreferrer"`.
- Include a visible text label on desktop when space allows.
- On small mobile screens, use a compact bottom action bar or merge it with the mobile CTA area.
- Never cover pricing buttons, cookie notices, legal links, or form controls.
- Account for iPhone safe-area insets.
- Respect `prefers-reduced-motion`.
- Do not use repetitive pulsing, shaking, or notification animations.
- A single subtle entrance animation is acceptable.

### Package-specific messages

Every enabled pricing card must generate a message containing:

- Product name.
- Selected plan.
- Duration.
- Price.
- Request for payment and activation instructions.

Example:

```text
مرحباً، أرغب بالاشتراك في مؤشر فانگارد.

الباقة: اشتراك 3 أشهر
السعر: 199 دولار

يرجى تزويدي بتفاصيل الدفع والتفعيل.
```

### Analytics

Track only an anonymous event:

```text
whatsapp_click
```

Optional non-identifying metadata:

- `source_section`
- `plan_id`

Do not transmit the phone number, visitor message, name, email, TradingView username, or any personal information to analytics.

---

## Contact workflow

Version one must use a manual workflow:

1. Visitor selects a package.
2. Website opens WhatsApp with the package name and price.
3. Seller confirms payment instructions.
4. Customer supplies their TradingView username privately.
5. Seller activates access manually.
6. Seller sends setup instructions.

Show a concise “كيف يتم الاشتراك؟” section explaining these steps.

Do not collect payment-card information on the static site.

Do not create a fake checkout.

---

## Configuration file

Place business and product settings in `src/config.js`.

Include:

```js
export const siteConfig = {
  brand: {
    nameAr: "مؤشر فانگارد",
    nameEn: "Vanguard Indicator"
  },
  contact: {
    whatsappNumber: "964XXXXXXXXXX",
    telegramUsername: "",
    email: "support@example.com"
  },
  business: {
    legalName: "[يجب الاستكمال قبل النشر]",
    physicalAddress: "[يجب الاستكمال قبل النشر]"
  },
  product: {
    supportsMobileAlerts: true,
    nonRepaintingClaimVerified: false,
    includesUpdates: false,
    showTestimonials: false,
    showEvidence: true
  },
  pricing: [
    {
      id: "one-month",
      months: 1,
      priceUsd: 95,
      enabled: false
    },
    {
      id: "three-months",
      months: 3,
      priceUsd: 199,
      enabled: true
    },
    {
      id: "six-months",
      months: 6,
      priceUsd: 450,
      enabled: true,
      requiresPriceReview: true
    },
    {
      id: "annual",
      months: 12,
      priceUsd: 795,
      enabled: true
    }
  ],
  media: {
    youtubeVideoId: "",
    ogImage: "/og-image-placeholder.webp"
  },
  analytics: {
    enabled: false,
    provider: "cloudflare",
    token: ""
  },
  deployment: {
    productionUrl: "https://YOUR-PROJECT.pages.dev"
  }
};
```

Do not expose secret keys in this file.

---

## Development quality rules

- Use strict, readable modular JavaScript.
- Add comments only where they explain non-obvious logic.
- Validate configuration.
- Escape or safely render dynamic text.
- Avoid `innerHTML` for untrusted content.
- Add graceful error handling.
- No console errors.
- No missing imports.
- No dead code.
- No duplicated pricing markup.
- No hard-coded contact details outside configuration.
- No inaccessible div-based buttons.
- No inline event handlers.
- No unnecessary global variables.
- No external CDN dependency when the npm package is already installed.
- Ensure RTL does not break icon direction or layout.
- Use logical CSS properties where practical.

---

## Required interactions

Implement and test:

- Sticky header.
- Mobile navigation.
- Smooth anchor scrolling, disabled or simplified with reduced motion.
- Active navigation state.
- Hero CTA.
- Video placeholder or lazy embed.
- Dynamic package selection.
- WhatsApp prefilled message.
- FAQ accordion.
- Mobile sticky CTA.
- Legal-page links.
- Three.js fallback.
- Scroll animations.
- Current footer year.
- No-JavaScript fallback message for the contact workflow.

---

## Plugin and tool usage

Use every relevant available development capability, but do not install tools merely to satisfy a count.

Where an AI coding environment offers plugins or skills, use them for:

- UI and front-end implementation.
- Browser preview and responsive inspection.
- Accessibility review.
- Performance review.
- GitHub repository setup and version control.
- Deployment configuration.
- Asset optimization.
- Code quality inspection.

Do not use image or video-generation plugins to fabricate trading results, testimonials, endorsements, or real product screenshots.

Generated decorative visuals must remain abstract and clearly decorative.

---

## Research-backed implementation notes

Follow these technical conclusions:

1. Use Vite because it creates a production static build in `dist` and supports local development and preview commands.
2. Install Three.js through npm and use ES modules with Vite rather than relying on improvised script imports.
3. Use GSAP and ScrollTrigger for controlled animation, but limit animation volume.
4. Deploy the static output to Cloudflare Pages.
5. Keep the site primarily static so static asset requests remain within the free hosting model.
6. Use Cloudflare Web Analytics as the default recommendation because it is free and privacy-oriented.
7. Treat Google advertising as a separate compliance process. Trading-signal destinations for complex speculative products may be disapproved, so never promise ad approval.
8. Keep fees, business identity, physical address, and disclosures clear and visible before paid advertising.
9. Respect reduced-motion preferences and provide non-animated fallbacks.

---


## Supplied logo setup in Visual Studio Code

The original supplied logo file must be added to the project before development begins.

Use this target path:

```text
public/assets/vanguard-logo.png
```

Recommended workflow:

1. Create `public/assets`.
2. Copy the supplied logo file into that folder.
3. Rename it to `vanguard-logo.png`.
4. Keep the original source file unchanged outside the project as a backup.
5. Generate a lightweight favicon derived from the V mark.
6. Generate an Open Graph image using the same black, green, and soft-white palette.
7. Compress web assets without introducing visible artifacts.

Reference the public asset in HTML as:

```html
<img
  src="/assets/vanguard-logo.png"
  alt="شعار مؤشر فانگارد"
  width="48"
  height="48"
/>
```

Do not import files from an absolute local Windows path because that will break after deployment.

---

## Cloudflare Pages deployment

After local testing:

```bash
npm run build
```

Push the repository to GitHub.

In Cloudflare:

1. Open Workers & Pages.
2. Create a Pages application.
3. Connect the GitHub repository.
4. Select the production branch, normally `main`.
5. Set the build command:

```text
npm run build
```

6. Set the output directory:

```text
dist
```

7. Deploy.
8. Replace all placeholder URLs with the generated `pages.dev` URL.
9. Rebuild.
10. Test all legal pages, CTAs, and mobile layouts.

Add deployment details to `README.md`.

---

## Git workflow

Initialize the repository:

```bash
git init
git add .
git commit -m "Initial Vanguard landing page"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Create useful commits:

```text
chore: scaffold Vite project
feat: build RTL landing page structure
feat: add Three.js hero scene
feat: add GSAP scroll animations
feat: add dynamic pricing and WhatsApp CTA
feat: add legal and risk pages
fix: improve mobile performance and accessibility
docs: add deployment instructions
```

---

## Testing checklist

Before declaring completion, test:

### Functional

- Every navigation link.
- Every CTA.
- Every enabled pricing plan.
- WhatsApp message formatting.
- Mobile menu open, close, Escape and focus.
- FAQ keyboard operation.
- Video placeholder.
- All legal pages.
- Production build.
- Direct opening of subpages.
- 404 behavior.

### Responsive sizes

- 320 px.
- 360 px.
- 390 px.
- 430 px.
- 768 px.
- 1024 px.
- 1440 px.

### Browsers

- Chrome.
- Edge.
- Firefox.
- Safari where available.
- iPhone Safari where available.
- Android Chrome where available.

### Accessibility

- Keyboard-only navigation.
- Visible focus.
- Reduced motion.
- Screen-reader labels.
- Heading order.
- Contrast.
- Zoom to 200%.
- RTL reading order.

### Performance

- Run Lighthouse on mobile.
- Inspect layout shift.
- Inspect large assets.
- Confirm Three.js loads after critical content.
- Confirm canvas animation pauses when hidden where implemented.
- Confirm no autoplay media.
- Confirm no console errors.

### Content and compliance

- No guaranteed-profit language.
- No fabricated testimonials.
- No fabricated results.
- No fake urgency.
- Risk disclosure visible.
- Business name completed.
- Physical address completed.
- Fees clear.
- Refund terms completed.
- Contact information working.
- Pricing inconsistency resolved.
- Non-repainting claim verified before enabling.
- Supported markets verified.

---

## Definition of done

The work is complete only when:

1. The project runs locally.
2. `npm run build` completes without errors.
3. The generated site is fully responsive.
4. Arabic RTL layout is correct.
5. Three.js animation works and has a fallback.
6. Reduced-motion mode works.
7. Pricing is generated from configuration.
8. WhatsApp contact flow works.
9. Legal pages exist.
10. Risk warnings are visible.
11. No false financial claims exist.
12. Lighthouse and keyboard testing have been performed.
13. README contains setup and Cloudflare deployment steps.
14. All unresolved business details are marked clearly.
15. No placeholder is silently presented as real information.
16. The supplied Vanguard logo is used without distortion.
17. The landing page follows the extracted black, green, and soft-white palette.
18. The WhatsApp floating button works on desktop and mobile.
19. Package CTAs generate the correct prefilled WhatsApp message.
20. The WhatsApp button does not overlap mobile safe areas or important content.

---

## Execution instruction

Start by inspecting the existing project directory.

If it is empty, scaffold the Vite vanilla project.

Then work in this order:

1. Create the project structure.
2. Create configuration and Arabic content modules.
3. Build semantic page markup.
4. Build mobile-first RTL styling.
5. Add dynamic pricing and contact workflow.
6. Add the Three.js hero.
7. Add GSAP animations.
8. Add FAQ and mobile navigation accessibility.
9. Add legal pages and risk disclosures.
10. Add SEO files and metadata.
11. Optimize assets and performance.
12. Run the build.
13. Fix every error and warning.
14. Test responsive behavior.
15. Provide a final report listing:
   - Files created.
   - Commands run.
   - Test results.
   - Remaining owner-supplied content.
   - Exact Cloudflare deployment steps.

Do not stop after generating a plan. Create the actual working files.
