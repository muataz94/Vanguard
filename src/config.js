// TODO: تأكيد جميع الأسعار وشروط الاسترجاع وبيانات النشاط قبل النشر الإنتاجي.
export const siteConfig = {
  brand: { nameAr: 'مؤشر فانگارد', nameEn: 'Vanguard Indicator' },
  contact: {
    whatsappNumber: '9647717220578',
    telegramUsername: '',
    email: 'support@example.com',
    defaultMessage: 'مرحباً، أرغب بالاستفسار عن مؤشر فانگارد والباقات المتاحة.'
  },
  business: {
    legalName: '[يجب الاستكمال قبل النشر]',
    physicalAddress: '[يجب الاستكمال قبل النشر]'
  },
  product: {
    supportsMobileAlerts: true,
    nonRepaintingClaimVerified: false,
    includesUpdates: false,
    showTestimonials: false,
    showEvidence: true,
    supportedMarketsVerified: false
  },
  pricing: [
    { id: 'one-month', months: 1, priceUsd: 95, enabled: false },
    { id: 'three-months', months: 3, priceUsd: 199, enabled: true },
    { id: 'six-months', months: 6, priceUsd: 450, enabled: true, requiresPriceReview: true },
    { id: 'annual', months: 12, priceUsd: 795, enabled: true }
  ],
  markets: ['الفوركس', 'العملات الرقمية', 'الأسهم', 'المؤشرات'],
  media: { youtubeVideoId: '', ogImage: '/og-image-placeholder.webp' },
  analytics: { enabled: false, provider: 'cloudflare', token: '' },
  deployment: { productionUrl: 'https://YOUR-PROJECT.pages.dev' }
};

export function validateConfig() {
  const warnings = [];
  const number = siteConfig.contact.whatsappNumber;
  if (!/^\d{10,15}$/.test(number)) warnings.push('رقم واتساب ما يزال قيمة مؤقتة؛ تم تعطيل روابط التواصل.');
  const three = siteConfig.pricing.find((plan) => plan.months === 3);
  const six = siteConfig.pricing.find((plan) => plan.months === 6);
  if (three && six && six.priceUsd > three.priceUsd * 2) warnings.push('سعر الستة أشهر أعلى من شراء باقتين لثلاثة أشهر؛ يلزم مراجعته.');
  return warnings;
}
