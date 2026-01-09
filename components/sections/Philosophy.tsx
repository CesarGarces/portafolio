'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Layers, Gauge, Wrench, TestTube, Users } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

const principleKeys = [
  { icon: Layers, key: 'cleanArchitecture' },
  { icon: Gauge, key: 'performance' },
  { icon: Wrench, key: 'maintainability' },
  { icon: TestTube, key: 'testing' },
  { icon: Users, key: 'dx' },
]

export default function Philosophy() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="philosophy"
      ref={ref}
      className="relative py-32 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            {t('philosophy.title')} <span className="text-primary-400">{t('philosophy.titleHighlight')}</span>
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('philosophy.description')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principleKeys.map((principle, index) => (
            <motion.div
              key={principle.key}
              className="group p-8 rounded-xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, borderColor: 'rgba(14, 165, 233, 0.3)' }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mb-6 group-hover:bg-primary-500/20 transition-colors">
                <principle.icon className="w-7 h-7 text-primary-400" />
              </div>

              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-400 transition-colors">
                {t(`philosophy.${principle.key}.title`)}
              </h3>

              <p className="text-foreground/80 leading-relaxed mb-6">
                {t(`philosophy.${principle.key}.description`)}
              </p>

              <ul className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                    <span className="text-primary-400 mt-1">→</span>
                    <span>{t(`philosophy.${principle.key}.details.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 max-w-4xl mx-auto p-8 rounded-xl border border-primary-500/20 bg-primary-500/5"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-lg text-foreground/90 leading-relaxed text-center text-balance">
            {t('philosophy.quote')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
