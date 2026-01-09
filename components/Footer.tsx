'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'
import { SOCIAL_LINKS } from '@/components/constants'

export default function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-foreground/10 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            className="text-sm text-foreground/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('footer.text', { year: currentYear })}
          </motion.p>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href={SOCIAL_LINKS.email}
              className="text-foreground/60 hover:text-primary-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-green-400 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
