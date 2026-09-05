/**
 * Static language catalog shared by the i18next runtime (i18n.ts) and the
 * dependency-free static language switcher (language-switcher-static.ts).
 * Kept free of i18next imports so lightweight pages never pull the whole
 * i18n runtime just to render a language dropdown.
 */

export const supportedLanguages = [
  'en',
  'ar',
  'be',
  'ru',
  'fr',
  'de',
  'es',
  'zh',
  'zh-TW',
  'vi',
  'tr',
  'id',
  'it',
  'pt',
  'nl',
  'da',
  'sv',
  'ko',
  'ja',
  'uk',
  'sk',
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  ar: 'العربية',
  be: 'Беларуская',
  ru: 'Русский',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  zh: '中文',
  'zh-TW': '繁體中文（台灣）',
  vi: 'Tiếng Việt',
  tr: 'Türkçe',
  id: 'Bahasa Indonesia',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  da: 'Dansk',
  sv: 'Svenska',
  ko: '한국어',
  ja: '日本語',
  uk: 'Українська',
  sk: 'Slovenčina',
};

export const languagePattern =
  'en|ar|fr|es|de|zh|zh-TW|vi|tr|id|it|pt|nl|be|da|ko|sv|ru|ja|uk|sk';

/**
 * Detect the language prefix of a path (e.g. "/zh/merge-pdf" -> "zh").
 * Returns undefined when the path has no language prefix (English root).
 */
export function getLanguageFromPath(pathname: string): SupportedLanguage | undefined {
  const match = pathname.match(new RegExp(`^/(${languagePattern})(?=/|$)`));
  if (match && supportedLanguages.includes(match[1] as SupportedLanguage)) {
    return match[1] as SupportedLanguage;
  }
  return undefined;
}

/**
 * Return the equivalent path for another language, preserving any existing
 * language prefix and the original suffix (.html or extensionless).
 * English pages live at the site root (no /en/ prefix).
 */
export function localizePath(pathname: string, lang: SupportedLanguage): string {
  const withoutLang = pathname.replace(
    new RegExp(`^/(?:${languagePattern})(?=/|$)`),
    ''
  );
  const rest = withoutLang || '/';
  if (lang === 'en') {
    return rest;
  }
  return `/${lang}${rest}`;
}
