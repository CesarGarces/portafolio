import type { Locale, Translations } from './types'
import esTranslations from '@/locales/es.json'
import enTranslations from '@/locales/en.json'

const translationsMap: Record<Locale, Translations> = {
  es: esTranslations,
  en: enTranslations,
}

/**
 * Loads translations for a given locale
 */
export function loadTranslations(locale: Locale): Translations {
  return translationsMap[locale] || translationsMap.es
}

/**
 * Preloads all translations (useful for SSR or prefetching)
 */
export function preloadTranslations(): Record<Locale, Translations> {
  return translationsMap
}
