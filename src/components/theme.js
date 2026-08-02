const storageKey = 'vanguard-theme';
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute('content', theme === 'dark' ? '#050706' : '#f5faf7');
}

if (!document.documentElement.dataset.theme) {
  applyTheme(readStoredTheme() || (colorScheme.matches ? 'dark' : 'light'));
}

export function initThemeToggle() {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return () => {};

  const syncToggle = () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن');
    toggle.title = isDark ? 'الوضع الفاتح' : 'الوضع الداكن';
  };
  const onToggle = () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { window.localStorage.setItem(storageKey, nextTheme); } catch { /* The selected theme still applies for this visit. */ }
    applyTheme(nextTheme);
    syncToggle();
  };
  const onSystemChange = (event) => {
    if (readStoredTheme()) return;
    applyTheme(event.matches ? 'dark' : 'light');
    syncToggle();
  };

  toggle.addEventListener('click', onToggle);
  colorScheme.addEventListener('change', onSystemChange);
  syncToggle();

  return () => {
    toggle.removeEventListener('click', onToggle);
    colorScheme.removeEventListener('change', onSystemChange);
  };
}
