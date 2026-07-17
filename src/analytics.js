import { siteConfig } from './config.js';

const allowedEvents = new Set(['cta_click', 'pricing_plan_click', 'video_play', 'faq_open', 'whatsapp_click']);

export function trackEvent(name, metadata = {}) {
  if (!siteConfig.analytics.enabled || !allowedEvents.has(name)) return;
  const safeMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([key]) => ['source_section', 'plan_id'].includes(key))
  );
  window.dispatchEvent(new CustomEvent('vanguard:analytics', { detail: { name, metadata: safeMetadata } }));
}

export function initAnalytics() {
  const { analytics } = siteConfig;
  if (!analytics.enabled || analytics.provider !== 'cloudflare' || !analytics.token) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.dataset.cfBeacon = JSON.stringify({ token: analytics.token });
  document.head.append(script);
}
