/**
 * Dependency-free language switcher for static pages.
 *
 * Mounted by the shared navbar partial on every page (tool pages do not run
 * the i18next runtime), so the switcher must not import i18next — it links to
 * the pre-generated per-locale static pages and preserves the current URL
 * shape (extensionless or .html).
 */

import {
  supportedLanguages,
  languageNames,
  getLanguageFromPath,
  localizePath,
  type SupportedLanguage,
} from './language-catalog.js';

const DESKTOP_MOUNT_ID = 'nav-lang-switcher';
const MOBILE_MOUNT_ID = 'mobile-lang-switcher';

function currentLanguage(): SupportedLanguage {
  // Static pages are localized per URL (root = English); the label must
  // reflect the page actually being shown, not any stored i18next pref.
  return getLanguageFromPath(window.location.pathname) ?? 'en';
}

function createSwitcher(mobile: boolean): HTMLElement {
  const current = currentLanguage();

  const container = document.createElement('div');
  container.className = mobile
    ? 'lang-switcher-mobile flex justify-center py-2'
    : 'lang-switcher relative ml-2';

  const details = document.createElement('details');
  details.className = 'relative lang-switcher-details';

  const summary = document.createElement('summary');
  summary.className =
    'inline-flex items-center gap-1.5 text-sm font-medium bg-white/5 text-gray-200 border border-white/10 px-3 py-1.5 rounded-full cursor-pointer select-none list-none hover:bg-white/10 transition-colors duration-200';
  summary.style.listStyle = 'none';
  summary.setAttribute('aria-label', 'Change language');

  const label = document.createElement('span');
  label.textContent = languageNames[current];
  label.className = 'lang-switcher-label';

  const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chevron.setAttribute('class', 'w-3.5 h-3.5');
  chevron.setAttribute('fill', 'none');
  chevron.setAttribute('stroke', 'currentColor');
  chevron.setAttribute('viewBox', '0 0 24 24');
  chevron.innerHTML =
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>';
  summary.append(label, chevron);

  const panel = document.createElement('div');
  panel.className =
    'absolute right-0 mt-2 z-50 w-48 max-h-80 overflow-y-auto rounded-lg bg-[#0f1322] border border-white/10 shadow-xl py-1 lang-switcher-panel';
  panel.setAttribute('role', 'menu');

  for (const lang of supportedLanguages) {
    const link = document.createElement('a');
    link.href = localizePath(window.location.pathname, lang);
    link.setAttribute('role', 'menuitem');
    link.className =
      'block w-full text-left px-4 py-1.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors';
    link.textContent = languageNames[lang];
    if (lang === current) {
      link.className += ' bg-white/5 text-white font-medium';
    }
    panel.appendChild(link);
  }

  details.appendChild(summary);
  details.appendChild(panel);
  container.appendChild(details);

  if (mobile) {
    // The mobile menu is vertically stacked/centered; panel should drop down
    // from the centered button without clipping.
    const inner = panel;
    inner.classList.remove('right-0');
    inner.classList.add('left-1/2', '-translate-x-1/2', 'mt-1');
  }

  // Close after navigation is handled by the browser. Close on outside click
  // so the dropdown does not linger after focus moves away.
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) {
      details.removeAttribute('open');
    }
  });

  details.addEventListener('toggle', () => {
    const isOpen = details.hasAttribute('open');
    summary.setAttribute('aria-expanded', String(isOpen));
  });

  return container;
}

function mountAll(): void {
  const desktop = document.getElementById(DESKTOP_MOUNT_ID);
  if (desktop && !desktop.firstChild) {
    desktop.appendChild(createSwitcher(false));
  }

  const mobile = document.getElementById(MOBILE_MOUNT_ID);
  if (mobile && !mobile.firstChild) {
    mobile.appendChild(createSwitcher(true));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll);
} else {
  mountAll();
}
