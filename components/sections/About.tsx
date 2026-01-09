'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Users, TrendingUp } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const valueKeys = [
  { icon: Target, key: 'impact' },
  { icon: Users, key: 'leadership' },
  { icon: TrendingUp, key: 'scalability' },
]

export default function About() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              {t('about.title')} <span className="text-primary-400">{t('about.titleHighlight')}</span>
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto mb-20"
          >
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed mb-6 text-balance">
              {t('about.paragraph1')}
            </p>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed mb-6 text-balance">
              {t('about.paragraph2')}
            </p>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed text-balance">
              {t('about.paragraph3')}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {valueKeys.map((value, index) => (
              <motion.div
                key={value.key}
                className="p-8 rounded-xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-300"
                whileHover={{ y: -5, borderColor: 'rgba(14, 165, 233, 0.3)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t(`about.values.${value.key}.title`)}</h3>
                <p className="text-foreground/70 leading-relaxed">{t(`about.values.${value.key}.description`)}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
