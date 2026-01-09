'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Mail, Linkedin, Github, MessageCircle } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'
import { SOCIAL_LINKS } from '@/components/constants'

const socialLinks = [
  {
    icon: Mail,
    label: 'Email',
    href: SOCIAL_LINKS.email,
    color: 'text-blue-400',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: SOCIAL_LINKS.linkedin,
    color: 'text-blue-500',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: SOCIAL_LINKS.github,
    color: 'text-foreground/80',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: SOCIAL_LINKS.whatsapp,
    color: 'text-green-400',
  },
]

export default function Contact() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 px-4 sm:px-6 lg:px-8 bg-foreground/5"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-primary-400">{t('contact.title')}</span>
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">{t('contact.connect')}</h3>
          <p className="text-foreground/70 mb-12 leading-relaxed text-center">
            {t('contact.connectDescription')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg border border-foreground/10 bg-background hover:border-primary-500/30 hover:bg-foreground/5 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                whileHover={{ x: 5, scale: 1.02 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                  <link.icon className={`w-6 h-6 ${link.color}`} />
                </div>
                <span className="font-medium text-foreground/90 group-hover:text-primary-400 transition-colors">
                  {link.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
