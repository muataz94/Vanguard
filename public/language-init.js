(function () {
  var language = 'ar';
  try {
    if (window.localStorage.getItem('vanguard-language') === 'en') language = 'en';
  } catch (_) {
    // Arabic remains the safe default when storage is unavailable.
  }
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dataset.language = language;
}());
