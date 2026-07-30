# Static-site security controls

## Implemented controls

Vanguard is a static Vite site deployed through GitHub Pages. The repository implements controls that are meaningful in that environment:

- A restrictive Content Security Policy is declared with an HTML `meta` element on every page.
- Scripts, images, connections, frames, workers, objects, forms, and font/style origins are limited to the sources the current site needs.
- The only inline script is static JSON-LD on the home page and is authorized with its exact SHA-256 CSP hash.
- Inline event handlers and inline style attributes are not used in production HTML.
- WhatsApp contact URLs accept only an international number containing 10–15 digits and always use `https://wa.me/`.
- Configured email addresses are validated before a `mailto:` link is created.
- Links opened in a new tab receive `rel="noopener noreferrer"`.
- Dynamic product copy is inserted with `textContent` and DOM construction rather than `innerHTML`.
- Analytics is disabled by default and its event boundary accepts only anonymous event names, source sections, and plan IDs.
- The Pages deployment gives write permissions only to the deployment job.
- Dependabot, CodeQL, and security CI cover dependency, source, build, browser, accessibility, and static-security checks.

## GitHub Pages limitations

GitHub Pages does not let this repository configure arbitrary HTTP response headers. The CSP therefore uses `<meta http-equiv="Content-Security-Policy">`, which is a partial mitigation:

- it applies only after the browser parses the element;
- it cannot enforce every CSP directive;
- `frame-ancestors` is not supported in a meta CSP;
- it does not replace response-header controls.

The repository does **not** claim that security response headers are active. Production response headers must be inspected independently after every hosting change.

## Recommended edge or CDN headers

If the site moves behind a configurable edge or CDN, set and verify these as HTTP response headers:

- `Content-Security-Policy`, including a restrictive `frame-ancestors` directive;
- `Strict-Transport-Security`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `Cross-Origin-Opener-Policy`.

Do not state that any of these headers are enabled until the deployed response has been checked.

## Data and secrets

The site has no account, payment-card, or personal-data form. Users are warned not to send card or sensitive financial data through messages. Client-side Vite variables are public by design; secrets and GitHub tokens must never be placed in `VITE_*` values, committed environment files, HTML, or bundles.

If analytics is deliberately enabled later, its external script and connection origins must be reviewed and explicitly added to the CSP before deployment. Message bodies, phone numbers, TradingView usernames, and other personal identifiers must remain outside analytics events.

## Unresolved launch inputs

These values remain unresolved and must be completed or approved before commercial publication:

- Legal business name: `[يجب الاستكمال قبل النشر]`
- Physical address: `[يجب الاستكمال قبل النشر]`
- Support email: `[يجب الاستكمال قبل النشر]`
- Final refund conditions: `[يجب الاستكمال قبل النشر]`
- Verified non-repainting behavior: `[يجب الاستكمال قبل النشر]`
- Included future updates: `[يجب الاستكمال قبل النشر]`
- Verified supported markets and settings: `[يجب الاستكمال قبل النشر]`
- Reviewed, permission-based evidence examples: `[يجب الاستكمال قبل النشر]`
- Six-month price review: `[يجب الاستكمال قبل النشر]`
