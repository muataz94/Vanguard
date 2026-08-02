(function initializeVanguardTheme() {
  var selectedTheme = null;
  try {
    var storedTheme = window.localStorage.getItem('vanguard-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') selectedTheme = storedTheme;
  } catch {
    selectedTheme = null;
  }
  if (!selectedTheme) selectedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = selectedTheme;
}());
