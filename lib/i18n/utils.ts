import type { Locale, Translations } from './types'
import { i18nConfig } from './config'

/**
 * Detects the browser's preferred language
 * Falls back to default locale if browser language is not supported
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return i18nConfig.defaultLocale
  }

  const browserLang = navigator.language.split('-')[0] as Locale

  return i18nConfig.supportedLocales.includes(browserLang)
    ? browserLang
    : i18nConfig.defaultLocale
}

/**
 * Gets the stored locale from localStorage
 * Returns null if not found or invalid
 */
export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(i18nConfig.storageKey) as Locale | null
    return stored && i18nConfig.supportedLocales.includes(stored) ? stored : null
  } catch {
    return null
  }
}

/**
 * Gets the initial locale (stored > browser > default)
 */
export function getInitialLocale(): Locale {
  return getStoredLocale() || detectBrowserLocale() || i18nConfig.defaultLocale
}

/**
 * Stores the locale in localStorage
 */
export function storeLocale(locale: Locale): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(i18nConfig.storageKey, locale)
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Gets a nested translation value by path
 * Example: getNestedValue(translations, 'nav.home') => 'Inicio'
 */
export function getNestedValue(
  translations: Translations,
  path: string
): string {
  const keys = path.split('.')
  let value: Translations | string = translations

  for (const key of keys) {
    if (typeof value === 'object' && value !== null && key in value) {
      value = value[key]
    } else {
      return path // Return path if translation not found
    }
  }

  return typeof value === 'string' ? value : path
}

/**
 * Replaces placeholders in translation strings
 * Example: replacePlaceholders('Hello {name}', { name: 'World' }) => 'Hello World'
 */
export function replacePlaceholders(
  text: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    text
  )
}
