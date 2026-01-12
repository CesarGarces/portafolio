'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'
import { i18nConfig } from '@/lib/i18n/config'
import { useState, useRef, useEffect } from 'react'

const languages = [
  { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
  { code: 'en' as const, label: 'English', flag: '🇺🇸' },
]

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-foreground/10 bg-background/50 hover:bg-foreground/5 hover:border-primary-500/30 active:bg-foreground/10 transition-all duration-300 touch-manipulation"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/80" />
        <span className="text-xs sm:text-sm font-medium text-foreground/80 hidden sm:inline">
          {currentLanguage.code.toUpperCase()}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-foreground/60 text-xs sm:text-sm"
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 sm:w-48 rounded-lg border border-foreground/10 bg-background/95 backdrop-blur-md shadow-lg overflow-hidden z-50"
          >
            {languages.map((language) => {
              const isSelected = locale === language.code
              return (
                <motion.button
                  key={language.code}
                  onClick={() => {
                    setLocale(language.code)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-foreground/5 active:bg-foreground/10 transition-colors touch-manipulation"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">{language.flag}</span>
                  <span className="flex-1 text-sm font-medium text-foreground/90">
                    {language.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 text-primary-400" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
