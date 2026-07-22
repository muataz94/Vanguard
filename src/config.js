// TODO: تأكيد جميع الأسعار وشروط الاسترجاع وبيانات النشاط قبل النشر الإنتاجي.
export const siteConfig = {
  brand: { nameAr: 'مؤشر فانگارد', nameEn: 'Vanguard Indicator' },
  contact: {
    whatsappNumber: '9647717220578',
    telegramUsername: '',
    email: '',
    defaultMessage: 'مرحباً، أرغب بالاستفسار عن مؤشر فانگارد والباقات المتاحة.'
  },
  business: {
    legalName: '',
    physicalAddress: ''
  },
  product: {
    supportsMobileAlerts: true,
    nonRepaintingClaimVerified: false,
    includesUpdates: false,
    showTestimonials: false,
    showEvidence: false,
    supportedMarketsVerified: false
  },
  evidenceExamples: [],
  pricing: [
    { id: 'one-month', labelAr: 'شهر واحد', months: 1, priceUsd: 95, enabled: true },
    { id: 'three-months', labelAr: 'ثلاثة أشهر', months: 3, priceUsd: 199, enabled: true },
    { id: 'six-months', labelAr: 'ستة أشهر', months: 6, priceUsd: 450, enabled: true, requiresPriceReview: true },
    { id: 'annual', labelAr: 'اشتراك سنوي', months: 12, priceUsd: 795, enabled: true }
  ],
  markets: ['الفوركس', 'العملات الرقمية', 'الأسهم', 'المؤشرات'],
  media: { youtubeVideoId: '', ogImage: '/Vanguard/og-image.webp' },
  analytics: { enabled: false, provider: 'cloudflare', token: '' },
  deployment: { productionUrl: 'https://muataz94.github.io/Vanguard/' }
};

export function validateConfig() {
  const warnings = [];
  const number = siteConfig.contact.whatsappNumber;
  if (!/^\d{10,15}$/.test(number)) warnings.push('رقم واتساب ما يزال قيمة مؤقتة؛ تم تعطيل روابط التواصل.');
  if (!siteConfig.contact.email || /example\.com$/i.test(siteConfig.contact.email)) warnings.push('بريد الدعم غير معتمد بعد ولا يظهر للزوار.');
  if (!siteConfig.business.legalName) warnings.push('الاسم القانوني للنشاط غير مكتمل ولا يظهر للزوار.');
  if (!siteConfig.business.physicalAddress) warnings.push('العنوان الفعلي للنشاط غير مكتمل ولا يظهر للزوار.');
  if (!siteConfig.product.nonRepaintingClaimVerified) warnings.push('ادعاء عدم إعادة الرسم غير متحقق؛ يجب ألا يُعرض كميزة.');
  if (!siteConfig.evidenceExamples.length) warnings.push('قسم الأمثلة مخفي حتى تُضاف أمثلة موثقة ومصرح باستخدامها.');
  const three = siteConfig.pricing.find((plan) => plan.months === 3);
  const six = siteConfig.pricing.find((plan) => plan.months === 6);
  if (three && six && six.priceUsd > three.priceUsd * 2) warnings.push('سعر الستة أشهر أعلى من شراء باقتين لثلاثة أشهر؛ يلزم مراجعته.');
  warnings.push('سياسة الاسترجاع ما تزال غير مكتملة ويجب اعتمادها قبل البيع.');
  return warnings;
}
