'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Locale, Translations } from '@/lib/i18n/types'
import { getInitialLocale, storeLocale, loadTranslations } from '@/lib/i18n'
import { i18nConfig } from '@/lib/i18n/config'

interface I18nContextValue {
  locale: Locale
  translations: Translations
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isHydrated: boolean
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

interface I18nProviderProps {
  children: React.ReactNode
  initialLocale?: Locale
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  // Always start with default locale to match server-side rendering
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || i18nConfig.defaultLocale
  )
  const [translations, setTranslations] = useState<Translations>(
    loadTranslations(locale)
  )
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize locale after hydration to avoid mismatch
  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true)

    // Now we can safely detect and set the locale from client-side
    if (!initialLocale) {
      const detectedLocale = getInitialLocale()
      // Only update if different from current locale
      setLocaleState((currentLocale) => {
        if (detectedLocale !== currentLocale) {
          return detectedLocale
        }
        return currentLocale
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Update translations when locale changes
  useEffect(() => {
    setTranslations(loadTranslations(locale))
    if (isHydrated) {
      storeLocale(locale)
    }
  }, [locale, isHydrated])

  const setLocale = useCallback((newLocale: Locale) => {
    if (i18nConfig.supportedLocales.includes(newLocale)) {
      setLocaleState(newLocale)
    }
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.')
      let value: Translations | string = translations

      for (const k of keys) {
        if (typeof value === 'object' && value !== null && k in value) {
          value = value[k]
        } else {
          return key // Return key if translation not found
        }
      }

      const text = typeof value === 'string' ? value : key

      if (params) {
        return Object.entries(params).reduce(
          (acc, [paramKey, paramValue]) =>
            acc.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
          text
        )
      }

      return text
    },
    [translations]
  )

  return (
    <I18nContext.Provider value={{ locale, translations, setLocale, t, isHydrated }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
