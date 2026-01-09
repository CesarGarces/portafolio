export type Locale = 'es' | 'en'

export interface Translations {
  [key: string]: string | Translations
}

export interface I18nConfig {
  defaultLocale: Locale
  supportedLocales: Locale[]
  storageKey: string
}
