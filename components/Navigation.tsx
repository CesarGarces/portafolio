'use client'

import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'
import LanguageSwitcher from './LanguageSwitcher'

const navItemsKeys = [
  { key: 'nav.home', href: '#hero' },
  { key: 'nav.about', href: '#about' },
  { key: 'nav.skills', href: '#skills' },
  { key: 'nav.experience', href: '#experience' },
  { key: 'nav.projects', href: '#projects' },
  { key: 'nav.philosophy', href: '#philosophy' },
  { key: 'nav.contact', href: '#contact' },
  { key: 'nav.chat', href: '#chat' },
]

export default function Navigation() {
  const { t } = useI18n()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)
  })

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-background/80 backdrop-blur-md border-b border-foreground/10 shadow-sm'
        : 'bg-background/40 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#hero')
            }}
            className="text-base sm:text-lg md:text-xl font-semibold text-foreground hover:text-primary-400 transition-colors truncate max-w-[140px] sm:max-w-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            César Garcés
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {navItemsKeys.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.href)
                }}
                className="text-xs md:text-sm text-foreground/80 hover:text-primary-400 transition-colors relative group whitespace-nowrap"
                whileHover={{ y: -2 }}
                suppressHydrationWarning
              >
                {t(item.key)}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all group-hover:w-full" />
              </motion.a>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button & Language Switcher */}
          <div className="md:hidden flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <button
              className="text-foreground/90 hover:text-foreground p-2 hover:bg-foreground/10 active:bg-foreground/20 rounded transition-colors touch-manipulation flex items-center justify-center min-w-[44px] min-h-[44px]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-t border-foreground/10"
      >
        <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
          {navItemsKeys.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                handleNavClick(item.href)
              }}
              className="block text-sm sm:text-base text-foreground/80 hover:text-primary-400 active:text-primary-500 transition-colors py-1.5 sm:py-2 touch-manipulation"
              suppressHydrationWarning
            >
              {t(item.key)}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  )
}
