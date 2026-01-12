import type { Locale, Translations } from "@/lib/i18n/types"

export interface I18nContextValue {
  locale: Locale
  translations: Translations
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isHydrated: boolean
}