/** @typedef {'ar' | 'en'} Language */

export const LANGUAGE_STORAGE_KEY = 'vanguard-language';

const ar = {
  'meta.title': 'مؤشر فانگارد | أداة تحليل وتنبيهات لمنصة TradingView',
  'meta.description': 'مؤشر فانگارد أداة تحليلية لمنصة TradingView تساعد على تنظيم قراءة الإشارات ومناطق المتابعة والتنبيهات ضمن سير عمل واضح.',
  'meta.ogTitle': 'مؤشر فانگارد — أداة تحليل وتنبيهات لمنصة TradingView',
  'meta.ogDescription': 'نظّم قراءة الإشارات ومناطق المتابعة وتنبيهات الهاتف ضمن سير عمل أوضح.',
  'meta.twitterTitle': 'مؤشر فانگارد',
  'meta.twitterDescription': 'أداة تحليلية مساعدة لمنصة TradingView.',
  'common.whatsapp': 'واتساب',
  'common.whatsappAria': 'تواصل معنا عبر واتساب',
  'common.choosePlan': 'اختر باقتك',
  'skip.main': 'انتقل إلى المحتوى الرئيسي',
  'brand.homeAria': 'Vanguard Indicator — مؤشر فانگارد — الصفحة الرئيسية',
  'nav.menuOpen': 'فتح قائمة التنقل',
  'nav.menuClose': 'إغلاق قائمة التنقل',
  'nav.aria': 'التنقل الرئيسي',
  'nav.benefits': 'المزايا',
  'nav.workflow': 'طريقة العمل',
  'nav.demo': 'العرض',
  'nav.pricing': 'الباقات',
  'nav.faq': 'الأسئلة',
  'language.action': 'تغيير اللغة إلى الإنجليزية',
  'language.groupAria': 'اختيار لغة الموقع',
  'language.ar': 'العربية',
  'language.en': 'الإنجليزية',
  'theme.enableLight': 'تفعيل الوضع الفاتح',
  'theme.enableDark': 'تفعيل الوضع الداكن',
  'theme.light': 'الوضع الفاتح',
  'theme.dark': 'الوضع الداكن',
  'hero.eyebrow': 'تحليل أوضح · متابعة أسرع · قرار منضبط',
  'hero.title': 'حوّل ازدحام الرسم إلى',
  'hero.titleEm': 'سير عمل أوضح',
  'hero.lead1': 'مؤشر فانگارد هو استراتيجية آلية مبرمجة لتقوم بكل شي من تحليل الاسواق و تحديد الاتجاه وتحييد الصفقة الجيدة عن السيئة اي ما يعني انه لن تحتاج الى ان تفعل اي شي بنفسك',
  'hero.lead2': 'وانما تنتظر اشعار المنبه ليقول لك ان صفقة البيع او الشراء الان متاحة',
  'hero.lead3': 'وتقوم انت بالدخول اليها وتضع مكانات الستوب والهدف وتغلق المنصة وتكمل حياتك بالشكل الطبيعي',
  'hero.secondaryCta': 'استكشف طريقة العمل',
  'hero.trustAria': 'مزايا أساسية',
  'hero.trust1': 'متوافق مع TradingView',
  'hero.trust2': 'تنبيهات على الهاتف',
  'hero.trust3': 'تفعيل يدوي ودعم مباشر',
  'hero.risk': 'أداة تحليلية مساعدة وليست توصية مالية أو ضماناً للنتائج. تحقق من كل إعداد وأدر المخاطر قبل التداول.',
  'benefits.index': '01 — المزايا',
  'benefits.title': 'أدوات عملية، بلا',
  'benefits.titleEm': 'وعود مبالغ فيها',
  'benefits.intro': 'واجهة بصرية وتنبيهات وأدوات مساعدة لتنظيم المراجعة—مع بقاء الحكم الشخصي وإدارة المخاطر مسؤولية المستخدم.',
  'benefits.1.title': 'إشارات مرئية واضحة',
  'benefits.1.copy': 'قراءة بصرية مرتبة تساعدك على ملاحظة الشروط التي تحددها إعدادات المؤشر.',
  'benefits.2.title': 'مناطق دخول وخروج منظمة',
  'benefits.2.copy': 'عرض منظم للمناطق المحتملة مع إبقاء قرار التنفيذ وإدارة المخاطر بيدك.',
  'benefits.3.title': 'تنبيهات فورية',
  'benefits.3.copy': 'إمكانية إعداد تنبيهات TradingView ومتابعتها على الهاتف عند تحقق الشروط.',
  'benefits.4.title': 'دعم أسواق متعددة',
  'benefits.4.copy': 'واجهة مصممة للاستخدام مع فئات سوق متنوعة بعد التحقق من ملاءمة الإعدادات.',
  'benefits.5.title': 'تقليل وقت المراقبة',
  'benefits.5.copy': 'يساعد على تقليل المتابعة اليدوية المستمرة دون إلغاء الحاجة إلى التقييم الشخصي.',
  'benefits.6.title': 'تجربة متوافقة مع الهاتف',
  'benefits.6.copy': 'تنبيهات واضحة وإرشادات إعداد مبسطة للعمل ضمن منظومة TradingView.',
  'benefits.zone': 'منطقة متابعة',
  'benefits.invalidation': 'نقطة إلغاء',
  'benefits.mobileAlert': 'تنبيه الهاتف',
  'benefits.days': 'أحد  اثنين  ثلاثاء  أربعاء  خميس',
  'workflow.index': '02 — طريقة العمل',
  'workflow.title': 'من التفعيل إلى التنبيه في',
  'workflow.titleEm': 'خمس خطوات',
  'workflow.intro': 'مسار مفهوم يساعدك على بدء الاستخدام دون تحويل الأداة إلى بديل عن خطتك.',
  'workflow.1.title': 'أضف المؤشر',
  'workflow.1.copy': 'تُرسل إليك خطوات إضافة المؤشر إلى حساب TradingView بعد التفعيل.',
  'workflow.2.title': 'اختر السوق والإطار',
  'workflow.2.copy': 'حدّد الأصل المالي والإطار الزمني المناسبين لخطة تداولك.',
  'workflow.3.title': 'راجع الإشارة',
  'workflow.3.copy': 'اقرأ الإشارة المرئية وشروط التأكيد قبل اتخاذ أي قرار.',
  'workflow.4.title': 'فعّل التنبيهات',
  'workflow.4.copy': 'اضبط التنبيهات لتصل عند تحقق الشروط المحددة.',
  'workflow.5.title': 'طبّق إدارة المخاطر',
  'workflow.5.copy': 'حدّد حجم المخاطرة ونقطة الإلغاء قبل كل صفقة.',
  'demo.index': '03 — عرض بصري',
  'demo.title': 'كيف تتحول الإشارة إلى',
  'demo.titleEm': 'مراجعة منظّمة',
  'demo.intro': 'راجع خطوات تقييم الإشارة، ثم استكشف حركة السوق داخل الرسم التفاعلي المستقل.',
  'demo.tabsAria': 'خطوات العرض',
  'demo.signal': '01 الإشارة',
  'demo.context': '02 السياق',
  'demo.alert': '03 التنبيه',
  'demo.signalCopy': 'تظهر منطقة المتابعة بصريًا لتبدأ منها المراجعة، لا لتنفذ الصفقة تلقائيًا.',
  'demo.contextCopy': 'راجع اتجاه السوق والإطار الزمني ونقطة الإلغاء قبل تقييم الإشارة.',
  'demo.alertCopy': 'بعد ضبط شروطك في TradingView، يمكن أن يصلك التنبيه على الهاتف لتعود إلى الرسم.',
  'demo.viewportAria': 'معاينة قابلة للتمرير أفقياً على الشاشات الصغيرة',
  'demo.imageAlt': 'لقطة شاشة لمؤشر Vanguard على رسم الذهب مقابل الدولار داخل TradingView، وتظهر عليها مناطق المتابعة والإشارات المرئية',
  'demo.captionTitle': 'واجهة مؤشر Vanguard على TradingView',
  'demo.captionCopy': 'صورة توضيحية للمؤشر المرفق، وليست توصية مالية أو ضمانًا للنتائج.',
  'chart.title': 'الرسم التفاعلي للسوق',
  'chart.description': 'استكشف حركة الذهب مقابل الدولار مباشرة داخل الرسم التفاعلي من TradingView.',
  'chart.risk': 'الرسم يعرض بيانات السوق من TradingView ولا يشكل توصية مالية أو ضماناً للنتائج.',
  'chart.loading': 'جارٍ تحميل الرسم التفاعلي…',
  'chart.error': 'تعذر تحميل الرسم التفاعلي حالياً.',
  'chart.errorCopy': 'يمكنك الاستمرار في تصفح الصفحة أو فتح مؤشر Vanguard مباشرة على TradingView.',
  'chart.open': 'فتح مؤشر Vanguard على TradingView',
  'chart.attribution': 'مخطط XAUUSD',
  'markets.index': '04 — الأسواق',
  'markets.title': 'واجهة واحدة، وسياق',
  'markets.titleEm': 'يختلف بين الأسواق',
  'markets.intro': 'اختيار فئة لا يعني أن كل إعداد مناسب لكل أصل أو إطار زمني. اختبر الإعداد قبل استخدامه.',
  'markets.tabsAria': 'فئات الأسواق',
  'markets.selectedCategory': 'الفئة المحددة',
  'markets.instrumentsAria': 'اختر أداة العرض التوضيحي',
  'markets.visualAria': 'رسم توضيحي محلي لا يعرض بيانات سوق مباشرة',
  'markets.forex.visualAria': 'مسارات توضيحية لأزواج العملات، ويظهر الزوج المحدد بخط أخضر أكثر وضوحاً',
  'markets.crypto.visualAria': 'شموع ونطاق تذبذب توضيحيان للأصل الرقمي المحدد، من دون أسعار مباشرة',
  'markets.stocks.visualAria': 'مقارنة توضيحية لمسارات الأسهم ومؤشر Nasdaq-100 المرجعي',
  'markets.indicators.visualAria': 'رسم توضيحي يتغير بين مؤشر Vanguard ومؤشري RSI وMACD',
  'markets.demo': 'معاينة تعليمية',
  'markets.context': 'السياق',
  'markets.userReview': 'يراجعه المستخدم',
  'markets.signal': 'الإشارة',
  'markets.bySettings': 'وفق الإعداد',
  'markets.disclaimer': 'عرض توضيحي — ليست بيانات سوق مباشرة ولا توصية مالية.',
  'markets.benchmark': 'مؤشر سوق مرجعي',
  'markets.forex.label': 'الفوركس',
  'markets.forex.short': 'مقارنة أزواج العملات الرئيسية ضمن عرض منظّم.',
  'markets.forex.title': 'مراجعة أسواق الفوركس',
  'markets.forex.description': 'استعرض أزواج العملات الرئيسية وقارن حركة الاتجاه ومناطق المراجعة قبل تطبيق إعدادات المؤشر.',
  'markets.crypto.label': 'العملات الرقمية',
  'markets.crypto.short': 'مراجعة الاتجاه والتذبذب لأصول رقمية مختارة.',
  'markets.crypto.title': 'مراجعة العملات الرقمية',
  'markets.crypto.description': 'راجع أصولاً رقمية مختلفة وقارن تذبذبها واتجاهها ضمن عرض توضيحي منظم.',
  'markets.stocks.label': 'الأسهم',
  'markets.stocks.short': 'مقارنة أسهم تقنية مختارة مع مؤشر سوق مرجعي.',
  'markets.stocks.title': 'مراجعة الأسهم والأسواق',
  'markets.stocks.description': 'قارن حركة أسهم شركات تقنية مختارة مع مؤشر سوقي مرجعي ضمن واجهة توضيحية واضحة.',
  'markets.indicators.label': 'المؤشرات',
  'markets.indicators.short': 'أمثلة توضيحية للاتجاه والزخم والإشارات.',
  'markets.indicators.title': 'مراجعة أدوات التحليل',
  'markets.indicators.description': 'استعرض أمثلة لأداة Vanguard ومؤشري الزخم RSI وMACD وقارن طرق عرض الاتجاه والتأكيد.',
  'markets.item.bitcoin': 'Bitcoin',
  'markets.item.ethereum': 'Ethereum',
  'markets.item.dogecoin': 'Dogecoin',
  'markets.item.solana': 'Solana',
  'markets.item.apple': 'Apple',
  'markets.item.alphabet': 'Alphabet',
  'markets.item.nvidia': 'NVIDIA',
  'markets.item.nasdaq': 'Nasdaq-100',
  'bundle.index': '05 — محتوى الباقة',
  'bundle.title': 'ما تحصل عليه',
  'bundle.titleEm': 'فعليًا',
  'bundle.intro': 'حزمة تركّز على الأداة، سياق المراجعة، والتنبيه—من دون إضافة مزايا أو نتائج غير مؤكدة.',
  'bundle.1.title': 'مؤشر Vanguard',
  'bundle.1.copy': 'الواجهة الرئيسية لعرض المناطق والإشارات وفق إعدادات المنتج.',
  'bundle.2.copy': 'طبقة مساعدة لمراجعة بنية السوق والسيولة ضمن السياق.',
  'bundle.3.title': 'مؤشر تأكيد إضافي',
  'bundle.3.copy': 'مرجع بصري ثانٍ ضمن عملية المراجعة قبل القرار.',
  'bundle.4.title': 'دليل إعداد ودعم تفعيل',
  'bundle.4.copy': 'خطوات بدء واضحة وقناة تواصل مباشرة عبر واتساب.',
  'bundle.consoleSuite': 'حزمة التحليل',
  'bundle.consoleSignals': 'الإشارات المرئية',
  'bundle.consoleContext': 'سياق السوق',
  'bundle.consoleAlerts': 'تنبيهات الهاتف',
  'bundle.consoleRisk': 'مراجعة المخاطر',
  'bundle.consoleReady': 'جاهز',
  'bundle.consoleUser': 'المستخدم',
  'evidence.title': 'أمثلة تعليمية موثقة',
  'pricing.index': '06 — الباقات',
  'pricing.title': 'المدة والسعر،',
  'pricing.titleEm': 'دون تعقيد',
  'pricing.intro': 'دفع يدوي مرة واحدة حسب الباقة. لا يوجد تجديد تلقائي أو إدخال بيانات دفع داخل الموقع.',
  'pricing.available': 'متاح للتفعيل اليدوي',
  'pricing.unavailable': 'غير متاح حالياً',
  'pricing.total': 'إجمالي الباقة بالدولار الأمريكي',
  'pricing.feature.1': 'المؤشر الرئيسي',
  'pricing.feature.2': 'مؤشرا Smart Money والتأكيد',
  'pricing.feature.3': 'إرشادات الإعداد والتفعيل',
  'pricing.feature.4': 'قناة دعم',
  'pricing.action': 'اطلب تفاصيل التفعيل',
  'pricing.plan.one-month': 'شهر واحد',
  'pricing.plan.three-months': 'ثلاثة أشهر',
  'pricing.plan.six-months': 'ستة أشهر',
  'pricing.plan.annual': 'اشتراك سنوي',
  'activation.index': '07 — التفعيل',
  'activation.title': 'من اختيار الباقة إلى الوصول',
  'activation.intro': 'لا يجمع الموقع بيانات بطاقات الدفع. يؤكد البائع التفاصيل والتفعيل يدويًا عبر قناة التواصل الرسمية.',
  'activation.privacy': 'لا ترسل بيانات بطاقة أو معلومات مالية حساسة عبر الرسائل.',
  'activation.step1': 'اختر الباقة',
  'activation.step2': 'تواصل عبر واتساب',
  'activation.step3': 'استلم تفاصيل الدفع',
  'activation.step4': 'أرسل اسم TradingView بشكل خاص',
  'activation.step5': 'استلم التفعيل ودليل الإعداد',
  'faq.index': '08 — الأسئلة الشائعة',
  'faq.title': 'ما تحتاج معرفته',
  'faq.titleEm': 'قبل التواصل',
  'faq.intro': 'إجابات مباشرة عن طبيعة الأداة، الهاتف، التفعيل، وحدود الاستخدام.',
  'faq.1.q': 'هل يضمن المؤشر الربح؟',
  'faq.1.a': 'لا. مؤشر فانگارد أداة تحليلية مساعدة، والتداول ينطوي على مخاطر قد تؤدي إلى خسارة رأس المال.',
  'faq.2.q': 'هل يعمل على الهاتف؟',
  'faq.2.a': 'يمكن متابعة تنبيهات TradingView على الهاتف عند تفعيلها. إعداد المؤشر وإدارته يعتمدان على خصائص حسابك ومنصة TradingView.',
  'faq.3.q': 'هل يعيد رسم الإشارات؟',
  'faq.3.a': 'لا يُقدَّم ادعاء عدم إعادة الرسم ضمن خصائص المنتج المعروضة. راجع كل إشارة ضمن سياقها ولا تعتمد على الأداة وحدها لاتخاذ القرار.',
  'faq.4.q': 'هل أحتاج إلى اشتراك TradingView مدفوع؟',
  'faq.4.a': 'يعتمد ذلك على عدد المؤشرات والتنبيهات والخصائص التي تحتاجها. راجع حدود خطة TradingView الحالية قبل الاشتراك.',
  'faq.5.q': 'ما الأسواق التي يمكن متابعتها؟',
  'faq.5.a': 'تتضمن الواجهة فئات الفوركس والعملات الرقمية والأسهم والمؤشرات. ملاءمة الإعداد تختلف حسب الأصل والإطار الزمني ويجب اختبارها قبل الاستخدام.',
  'faq.6.q': 'كيف يتم تفعيل المؤشر؟',
  'faq.6.a': 'بعد تأكيد الدفع يرسل العميل اسم مستخدم TradingView بصورة خاصة، ثم يُفعّل البائع الوصول ويرسل دليل الإعداد.',
  'faq.7.q': 'هل توجد سياسة استرجاع؟',
  'faq.7.a': 'لا توجد شروط استرجاع نهائية منشورة حاليًا. اطلب الشروط كتابيًا عبر قناة التواصل الرسمية قبل أي دفع، وراجع صفحة سياسة الاسترجاع.',
  'faq.8.q': 'هل التحديثات مشمولة؟',
  'faq.8.a': 'لا تُعد التحديثات المستقبلية جزءًا من الباقة ما لم تُؤكد كتابيًا ضمن تفاصيل التفعيل.',
  'faq.9.q': 'هل يمكن استخدامه على أكثر من حساب؟',
  'faq.9.a': 'يتم التفعيل على حساب TradingView الذي يحدده العميل. اسأل عن أي وصول إضافي قبل الدفع ولا تفترض أن الباقة تشمل عدة حسابات.',
  'faq.10.q': 'كيف أتواصل؟',
  'faq.10.a': 'استخدم زر واتساب الرسمي في الصفحة للاستفسار عن الباقات والدفع والتفعيل. لا ترسل بيانات بطاقة أو معلومات مالية حساسة.',
  'risk.index': 'تنبيه مخاطر مهم',
  'risk.title': 'لا توجد أداة تداول تضمن الربح',
  'risk.copy': 'التداول في الأسواق المالية ينطوي على مخاطر مرتفعة وقد يؤدي إلى خسارة جزء أو كامل رأس المال. مؤشر فانگارد أداة تحليلية مساعدة ولا يقدم ضمانًا للربح، ولا تشكل إشاراته نصيحة استثمارية شخصية. النتائج السابقة لا تضمن النتائج المستقبلية. يتحمل المستخدم المسؤولية الكاملة عن قراراته وإدارة رأس ماله.',
  'risk.link': 'اقرأ إفصاح المخاطر كاملًا',
  'final.index': 'ابدأ بخطوة واضحة',
  'final.title': 'راجع الباقات، ثم',
  'final.titleEm': 'تواصل مباشرة',
  'final.copy': 'سنرسل لك تفاصيل الدفع والتفعيل عبر واتساب قبل بدء الوصول.',
  'final.whatsapp': 'تواصل عبر واتساب',
  'footer.logoAlt': 'شعار مؤشر فانگارد',
  'footer.copy': 'أداة تحليلية مساعدة لمنصة TradingView لتنظيم قراءة الإشارات والتنبيهات، ولا تضمن النتائج المستقبلية.',
  'footer.links': 'روابط مهمة',
  'footer.demo': 'العرض البصري',
  'footer.faq': 'الأسئلة الشائعة',
  'footer.policies': 'السياسات',
  'footer.privacy': 'سياسة الخصوصية',
  'footer.terms': 'الشروط والأحكام',
  'footer.refund': 'سياسة الاسترجاع',
  'footer.risk': 'إفصاح المخاطر',
  'footer.contact': 'التواصل',
  'footer.identity': 'بيانات الناشر متاحة عبر قناة التواصل الرسمية.',
  'footer.copyright': 'مؤشر فانگارد. جميع الحقوق محفوظة.',
  'footer.warning': 'النتائج السابقة لا تضمن النتائج المستقبلية.',
  'scrollTop.aria': 'العودة إلى أعلى الصفحة',
  'mobile.actionsAria': 'إجراءات الاشتراك',
  'mobile.pricing': 'الباقات',
  'contact.defaultMessage': 'مرحباً، أرغب بالاستفسار عن مؤشر فانگارد والباقات المتاحة.',
  'contact.dialogClose': 'إغلاق نافذة التواصل',
  'contact.eyebrow': 'تواصل مباشر',
  'contact.title': 'كيف تفضّل التواصل؟',
  'contact.copy': 'اختر القناة المناسبة. لن يطلب منك الموقع أي بيانات دفع أو معلومات مالية.',
  'contact.email': 'إرسال بريد إلكتروني',
  'contact.copyEmail': 'نسخ البريد',
  'contact.noteEmail': 'يمكنك أيضًا العودة واختيار إحدى الباقات لإرسال تفاصيلها تلقائيًا.',
  'contact.noteNoEmail': 'استخدم قناة التواصل الرسمية الظاهرة في الصفحة للاستفسار عن التفعيل.',
  'contact.copied': 'تم نسخ البريد الإلكتروني.',
  'contact.copyFailed': 'تعذر النسخ. حدّد البريد وانسخه يدوياً.',
  'contact.copyManual': 'حدّد البريد الإلكتروني وانسخه يدوياً.',
  'contact.openOptions': 'فتح خيارات التواصل',
  'contact.unavailable': 'قناة التواصل غير متاحة مؤقتًا'
};

const en = {
  ...ar,
  'meta.title': 'Vanguard Indicator | TradingView Analysis and Alerts',
  'meta.description': 'Vanguard Indicator is a TradingView analysis tool that helps organize signals, review zones, and alerts within a clear workflow.',
  'meta.ogTitle': 'Vanguard Indicator — TradingView Analysis and Alerts',
  'meta.ogDescription': 'Organize signal reviews, focus zones, and mobile alerts within a clearer workflow.',
  'meta.twitterTitle': 'Vanguard Indicator',
  'meta.twitterDescription': 'A supporting analysis tool for TradingView.',
  'common.whatsapp': 'WhatsApp', 'common.whatsappAria': 'Contact us on WhatsApp', 'common.choosePlan': 'Choose Your Plan',
  'skip.main': 'Skip to main content', 'brand.homeAria': 'Vanguard Indicator — Home',
  'nav.menuOpen': 'Open navigation menu', 'nav.menuClose': 'Close navigation menu', 'nav.aria': 'Main navigation',
  'nav.benefits': 'Features', 'nav.workflow': 'How It Works', 'nav.demo': 'Demo', 'nav.pricing': 'Plans', 'nav.faq': 'FAQ',
  'language.action': 'Switch language to Arabic',
  'language.groupAria': 'Choose site language', 'language.ar': 'Arabic', 'language.en': 'English',
  'theme.enableLight': 'Enable light mode', 'theme.enableDark': 'Enable dark mode', 'theme.light': 'Light mode', 'theme.dark': 'Dark mode',
  'hero.eyebrow': 'Clearer analysis · Faster review · Disciplined decisions',
  'hero.title': 'Turn a crowded chart into', 'hero.titleEm': 'a clearer workflow',
  'hero.lead1': 'Vanguard Indicator is an automated strategy designed to analyze markets, identify trends, and distinguish stronger trade setups from weaker ones, reducing the need for constant manual monitoring.',
  'hero.lead2': 'You wait for an alert indicating that a potential buy or sell setup is available.',
  'hero.lead3': 'You can then review the setup, enter when appropriate, define the stop-loss and target levels, close the platform, and continue your day normally.',
  'hero.secondaryCta': 'Explore the workflow', 'hero.trustAria': 'Core benefits',
  'hero.trust1': 'Works with TradingView', 'hero.trust2': 'Mobile alerts', 'hero.trust3': 'Manual activation and direct support',
  'hero.risk': 'An analytical support tool, not financial advice or a guarantee of results. Verify every setup and manage risk before trading.',
  'benefits.index': '01 — BENEFITS', 'benefits.title': 'Practical tools, without', 'benefits.titleEm': 'exaggerated promises',
  'benefits.intro': 'Visual guidance, alerts, and supporting tools that organize your review—while judgment and risk management remain your responsibility.',
  'benefits.1.title': 'Clear visual signals', 'benefits.1.copy': 'An organized visual view that helps you notice the conditions defined by the indicator settings.',
  'benefits.2.title': 'Organized entry and exit zones', 'benefits.2.copy': 'Structured potential zones while execution and risk decisions remain fully in your hands.',
  'benefits.3.title': 'Timely alerts', 'benefits.3.copy': 'Configure TradingView alerts and follow them on your phone when your chosen conditions are met.',
  'benefits.4.title': 'Multiple market categories', 'benefits.4.copy': 'An interface designed for varied market categories after confirming that each setting is appropriate.',
  'benefits.5.title': 'Less manual monitoring', 'benefits.5.copy': 'Helps reduce constant chart watching without removing the need for your own assessment.',
  'benefits.6.title': 'Mobile-friendly experience', 'benefits.6.copy': 'Clear alerts and simple setup guidance within the TradingView ecosystem.',
  'benefits.zone': 'Review zone', 'benefits.invalidation': 'Invalidation point', 'benefits.mobileAlert': 'Mobile alert', 'benefits.days': 'Sun  Mon  Tue  Wed  Thu',
  'workflow.index': '02 — HOW IT WORKS', 'workflow.title': 'From activation to alerts in', 'workflow.titleEm': 'five steps',
  'workflow.intro': 'A clear path to get started without turning the tool into a substitute for your plan.',
  'workflow.1.title': 'Add the indicator', 'workflow.1.copy': 'You receive instructions for adding the indicator to your TradingView account after activation.',
  'workflow.2.title': 'Choose market and timeframe', 'workflow.2.copy': 'Select the asset and timeframe that fit your trading plan.',
  'workflow.3.title': 'Review the signal', 'workflow.3.copy': 'Assess the visual signal and confirmation conditions before making any decision.',
  'workflow.4.title': 'Enable alerts', 'workflow.4.copy': 'Configure alerts to arrive when your defined conditions are met.',
  'workflow.5.title': 'Apply risk management', 'workflow.5.copy': 'Set your risk size and invalidation point before every trade.',
  'demo.index': '03 — VISUAL DEMO', 'demo.title': 'How a signal becomes', 'demo.titleEm': 'an organized review',
  'demo.intro': 'Review the signal-assessment steps, then explore market movement in the independent interactive chart.',
  'demo.tabsAria': 'Demo steps', 'demo.signal': '01 Signal', 'demo.context': '02 Context', 'demo.alert': '03 Alert',
  'demo.signalCopy': 'The review zone appears visually as a starting point for assessment, not automatic execution.',
  'demo.contextCopy': 'Review market direction, timeframe, and the invalidation point before evaluating a signal.',
  'demo.alertCopy': 'Once your TradingView conditions are configured, a mobile alert can bring you back to the chart.',
  'demo.viewportAria': 'Horizontally scrollable preview on small screens',
  'demo.imageAlt': 'Screenshot of Vanguard Indicator on a gold versus US dollar TradingView chart showing visual signals and review zones',
  'demo.captionTitle': 'Vanguard Indicator interface on TradingView', 'demo.captionCopy': 'An illustrative image of the included indicator, not financial advice or a guarantee of results.',
  'chart.title': 'Interactive Market Chart',
  'chart.description': 'Explore gold versus the US dollar directly in the interactive TradingView chart.',
  'chart.risk': 'The chart displays market data from TradingView and is not financial advice or a guarantee of results.',
  'chart.loading': 'Loading the interactive chart…',
  'chart.error': 'The interactive chart is currently unavailable.',
  'chart.errorCopy': 'You can continue browsing or open Vanguard Indicator directly on TradingView.',
  'chart.open': 'Open Vanguard Indicator on TradingView',
  'chart.attribution': 'XAUUSD chart',
  'markets.index': '04 — MARKETS', 'markets.title': 'One interface, with context that', 'markets.titleEm': 'changes by market',
  'markets.intro': 'Choosing a category does not mean every setting suits every asset or timeframe. Test the setting before use.',
  'markets.tabsAria': 'Market categories', 'markets.selectedCategory': 'Selected category', 'markets.instrumentsAria': 'Choose a demonstration instrument',
  'markets.visualAria': 'Local demonstration chart that does not show live market data',
  'markets.forex.visualAria': 'Demonstration currency-pair paths with the selected pair emphasized in green',
  'markets.crypto.visualAria': 'Demonstration candlesticks and volatility band for the selected digital asset, without live prices',
  'markets.stocks.visualAria': 'Demonstration comparison paths for stocks and the Nasdaq-100 market benchmark',
  'markets.indicators.visualAria': 'Demonstration that changes between Vanguard Indicator, RSI, and MACD', 'markets.demo': 'Demonstration preview',
  'markets.context': 'Context', 'markets.userReview': 'Reviewed by the user', 'markets.signal': 'Signal', 'markets.bySettings': 'Based on settings',
  'markets.disclaimer': 'Demonstration only — not live market data or financial advice.', 'markets.benchmark': 'Market benchmark',
  'markets.forex.label': 'Forex', 'markets.forex.short': 'Compare major currency pairs in an organized view.',
  'markets.forex.title': 'Forex Market Review', 'markets.forex.description': 'Explore major currency pairs and compare trend movement and review zones before applying indicator settings.',
  'markets.crypto.label': 'Cryptocurrencies', 'markets.crypto.short': 'Review direction and volatility across selected digital assets.',
  'markets.crypto.title': 'Cryptocurrency Review', 'markets.crypto.description': 'Review different digital assets and compare their volatility and direction in a structured demonstration.',
  'markets.stocks.label': 'Stocks', 'markets.stocks.short': 'Compare selected technology stocks with a market benchmark.',
  'markets.stocks.title': 'Stocks and Markets Review', 'markets.stocks.description': 'Compare selected technology stocks with a market benchmark in a clear demonstration interface.',
  'markets.indicators.label': 'Indicators', 'markets.indicators.short': 'Demonstrations of trend, momentum, and signal tools.',
  'markets.indicators.title': 'Indicator Review', 'markets.indicators.description': 'Explore Vanguard alongside the RSI and MACD momentum indicators and compare how they present trends and confirmation.',
  'bundle.index': '05 — PACKAGE CONTENTS', 'bundle.title': 'What you actually', 'bundle.titleEm': 'receive',
  'bundle.intro': 'A package focused on the tool, review context, and alerts—without adding unverified features or outcomes.',
  'bundle.1.title': 'Vanguard Indicator', 'bundle.1.copy': 'The primary interface for displaying zones and signals according to product settings.',
  'bundle.2.copy': 'A supporting layer for reviewing market structure and liquidity in context.',
  'bundle.3.title': 'Additional confirmation indicator', 'bundle.3.copy': 'A second visual reference within the review process before making a decision.',
  'bundle.4.title': 'Setup guide and activation support', 'bundle.4.copy': 'Clear onboarding steps and a direct WhatsApp support channel.',
  'bundle.consoleSuite': 'ANALYSIS SUITE', 'bundle.consoleSignals': 'VISUAL SIGNALS', 'bundle.consoleContext': 'MARKET CONTEXT',
  'bundle.consoleAlerts': 'MOBILE ALERTS', 'bundle.consoleRisk': 'RISK REVIEW', 'bundle.consoleReady': 'READY', 'bundle.consoleUser': 'USER',
  'evidence.title': 'Documented educational examples',
  'pricing.index': '06 — PLANS', 'pricing.title': 'Duration and price,', 'pricing.titleEm': 'kept simple',
  'pricing.intro': 'A one-time manual payment for each plan. There is no automatic renewal or payment-data entry on this website.',
  'pricing.available': 'Available for manual activation', 'pricing.unavailable': 'Currently unavailable', 'pricing.total': 'Total package price in US dollars',
  'pricing.feature.1': 'Core indicator', 'pricing.feature.2': 'Smart Money and confirmation indicators', 'pricing.feature.3': 'Setup and activation guidance', 'pricing.feature.4': 'Support channel',
  'pricing.action': 'Request activation details', 'pricing.plan.one-month': 'One month', 'pricing.plan.three-months': 'Three months',
  'pricing.plan.six-months': 'Six months', 'pricing.plan.annual': 'Annual access',
  'activation.index': '07 — ACTIVATION', 'activation.title': 'From plan selection to access',
  'activation.intro': 'This website does not collect payment-card data. The seller confirms payment and activation manually through the official contact channel.',
  'activation.privacy': 'Never send card details or sensitive financial information through messages.',
  'activation.step1': 'Choose a plan', 'activation.step2': 'Contact us on WhatsApp', 'activation.step3': 'Receive payment details',
  'activation.step4': 'Send your TradingView username privately', 'activation.step5': 'Receive access and the setup guide',
  'faq.index': '08 — FAQ', 'faq.title': 'What to know', 'faq.titleEm': 'before contacting us',
  'faq.intro': 'Direct answers about the tool, mobile access, activation, and usage boundaries.',
  'faq.1.q': 'Does the indicator guarantee profit?', 'faq.1.a': 'No. Vanguard Indicator is a supporting analysis tool, and trading involves risks that may lead to a loss of capital.',
  'faq.2.q': 'Does it work on mobile?', 'faq.2.a': 'TradingView alerts can be followed on mobile when enabled. Indicator setup and management depend on your account and TradingView features.',
  'faq.3.q': 'Does it repaint signals?', 'faq.3.a': 'No non-repainting claim is made in the product features shown here. Review every signal in context and never rely on the tool alone.',
  'faq.4.q': 'Do I need a paid TradingView plan?', 'faq.4.a': 'That depends on the indicators, alerts, and features you need. Review the limits of your current TradingView plan before subscribing.',
  'faq.5.q': 'Which markets can I follow?', 'faq.5.a': 'The interface includes Forex, cryptocurrencies, stocks, and indicators. Setting suitability varies by asset and timeframe and must be tested before use.',
  'faq.6.q': 'How is the indicator activated?', 'faq.6.a': 'After payment is confirmed, the customer privately sends their TradingView username. The seller then enables access and sends the setup guide.',
  'faq.7.q': 'Is there a refund policy?', 'faq.7.a': 'Final refund terms are not currently published. Request the terms in writing through the official contact channel before paying and review the refund page.',
  'faq.8.q': 'Are updates included?', 'faq.8.a': 'Future updates are not part of the package unless confirmed in writing within the activation details.',
  'faq.9.q': 'Can I use it on more than one account?', 'faq.9.a': 'Activation applies to the TradingView account specified by the customer. Ask about additional access before paying; do not assume multiple accounts are included.',
  'faq.10.q': 'How can I get in touch?', 'faq.10.a': 'Use the official WhatsApp button to ask about plans, payment, and activation. Never send card details or sensitive financial information.',
  'risk.index': 'Important risk notice', 'risk.title': 'No trading tool can guarantee profit',
  'risk.copy': 'Trading financial markets involves significant risk and may result in losing some or all of your capital. Vanguard Indicator is a supporting analysis tool, does not guarantee profit, and its signals are not personal investment advice. Past results do not guarantee future outcomes. You remain fully responsible for your decisions and risk management.',
  'risk.link': 'Read the full risk disclosure',
  'final.index': 'Start with a clear step', 'final.title': 'Review the plans, then', 'final.titleEm': 'contact us directly',
  'final.copy': 'We will send payment and activation details through WhatsApp before access begins.', 'final.whatsapp': 'Contact us on WhatsApp',
  'footer.logoAlt': 'Vanguard Indicator logo', 'footer.copy': 'A supporting TradingView analysis tool for organizing signal reviews and alerts; it does not guarantee future outcomes.',
  'footer.links': 'Important links', 'footer.demo': 'Visual demo', 'footer.policies': 'Policies', 'footer.privacy': 'Privacy policy',
  'footer.faq': 'FAQ',
  'footer.terms': 'Terms and conditions', 'footer.refund': 'Refund policy', 'footer.risk': 'Risk disclosure', 'footer.contact': 'Contact',
  'footer.identity': 'Publisher details are available through the official contact channel.', 'footer.copyright': 'Vanguard Indicator. All rights reserved.',
  'footer.warning': 'Past results do not guarantee future outcomes.', 'scrollTop.aria': 'Back to the top of the page',
  'mobile.actionsAria': 'Subscription actions', 'mobile.pricing': 'Plans',
  'contact.defaultMessage': 'Hello, I would like to ask about Vanguard Indicator and the available plans.',
  'contact.dialogClose': 'Close contact dialog', 'contact.eyebrow': 'Direct contact', 'contact.title': 'How would you like to contact us?',
  'contact.copy': 'Choose the channel that suits you. This website will never ask for payment details or financial information.',
  'contact.email': 'Send an email', 'contact.copyEmail': 'Copy email address',
  'contact.noteEmail': 'You can also return and choose a plan to include its details automatically.',
  'contact.noteNoEmail': 'Use the official contact channel shown on this page for activation questions.',
  'contact.copied': 'Email address copied.', 'contact.copyFailed': 'Copy failed. Select the email address and copy it manually.',
  'contact.copyManual': 'Select the email address and copy it manually.', 'contact.openOptions': 'Open contact options',
  'contact.unavailable': 'The contact channel is temporarily unavailable.'
};

/** @type {Record<Language, Record<string, string>>} */
const dictionaries = { ar, en };
/** @type {Language} */
let activeLanguage = typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'ar';
const listeners = new Set();

export function getLanguage() {
  return activeLanguage;
}

export function t(key) {
  return dictionaries[activeLanguage][key] ?? dictionaries.ar[key] ?? key;
}

export function translateElement(node, key, attribute) {
  if (!node) return node;
  if (attribute) {
    node.dataset[`i18n${attribute[0].toUpperCase()}${attribute.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}`] = key;
    node.setAttribute(attribute, t(key));
  } else {
    node.dataset.i18n = key;
    node.textContent = t(key);
  }
  return node;
}

function updateMetadata() {
  document.title = t('meta.title');
  const setMeta = (selector, key) => document.querySelector(selector)?.setAttribute('content', t(key));
  setMeta('meta[name="description"]', 'meta.description');
  setMeta('meta[property="og:title"]', 'meta.ogTitle');
  setMeta('meta[property="og:description"]', 'meta.ogDescription');
  setMeta('meta[name="twitter:title"]', 'meta.twitterTitle');
  setMeta('meta[name="twitter:description"]', 'meta.twitterDescription');
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', activeLanguage === 'ar' ? 'ar_IQ' : 'en_US');
  const structuredData = document.querySelector('script[type="application/ld+json"]');
  if (structuredData) {
    try {
      const data = JSON.parse(structuredData.textContent);
      data.name = activeLanguage === 'ar' ? 'مؤشر فانگارد — Vanguard Indicator' : 'Vanguard Indicator';
      data.inLanguage = activeLanguage;
      structuredData.textContent = JSON.stringify(data);
    } catch { /* Leave valid server-authored structured data untouched. */ }
  }
}

function matchingNodes(root, selector) {
  const nodes = [];
  if (root instanceof Element && root.matches(selector)) nodes.push(root);
  if (root.querySelectorAll) nodes.push(...root.querySelectorAll(selector));
  return nodes;
}

export function applyTranslations(root = document) {
  matchingNodes(root, '[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
  ['aria-label', 'title', 'alt', 'placeholder'].forEach((attribute) => {
    const property = `i18n${attribute[0].toUpperCase()}${attribute.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}`;
    matchingNodes(root, `[data-i18n-${attribute}]`).forEach((node) => node.setAttribute(attribute, t(node.dataset[property])));
  });
  updateMetadata();
}

function syncDocument() {
  document.documentElement.lang = activeLanguage;
  document.documentElement.dir = activeLanguage === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dataset.language = activeLanguage;
}

export function setLanguage(language, { persist = true } = {}) {
  if (language !== 'ar' && language !== 'en') return;
  const changed = language !== activeLanguage;
  activeLanguage = language;
  syncDocument();
  if (persist) {
    try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* Selection still applies for this visit. */ }
  }
  applyTranslations();
  if (changed) listeners.forEach((listener) => listener(language));
}

export function subscribeLanguage(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initLanguageSystem() {
  const options = [...document.querySelectorAll('[data-language-option]')];
  const syncOptions = () => {
    options.forEach((option) => {
      const active = option.dataset.languageOption === activeLanguage;
      option.setAttribute('aria-pressed', String(active));
      option.classList.toggle('is-active', active);
    });
  };
  const onSelect = (event) => setLanguage(event.currentTarget.dataset.languageOption);
  applyTranslations();
  syncOptions();
  options.forEach((option) => option.addEventListener('click', onSelect));
  const unsubscribe = subscribeLanguage(syncOptions);
  return () => {
    options.forEach((option) => option.removeEventListener('click', onSelect));
    unsubscribe();
  };
}
