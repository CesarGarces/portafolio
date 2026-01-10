'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useI18n } from '@/contexts/I18nContext'

// Skill levels configuration - keys represent skill indices
const skillLevels: Record<number, Record<number, number>> = {
  0: { 0: 95, 1: 95, 2: 90, 3: 85, 4: 95 }, // Frontend Core
  1: { 0: 90, 1: 90, 2: 85, 3: 85 }, // State Management
  2: { 0: 90, 1: 85, 2: 85, 3: 85 }, // Arquitectura
  3: { 0: 90, 1: 90, 2: 90, 3: 75, 4: 80 }, // Testing & Quality
  4: { 0: 80, 1: 85, 2: 80, 3: 75 }, // DevOps & Cloud
  5: { 0: 90, 1: 85, 2: 85, 3: 90 }, // Performance & Observability
}

const CATEGORIES_COUNT = Object.keys(skillLevels).length

export default function Skills() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const skillCategories = Array.from({ length: CATEGORIES_COUNT }, (_, categoryIndex) => {
    const categoryLevels = skillLevels[categoryIndex]
    const skillIndices = Object.keys(categoryLevels).map(Number)

    const skills = skillIndices.map((skillIndex) => ({
      name: t(`skills.categories.${categoryIndex}.skills.${skillIndex}`),
      level: categoryLevels[skillIndex],
    }))

    return {
      title: t(`skills.categories.${categoryIndex}.title`),
      skills,
    }
  })

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-32 px-4 sm:px-6 lg:px-8 bg-foreground/5"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            {t('skills.title')} <span className="text-primary-400">{t('skills.titleHighlight')}</span>
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('skills.description')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="p-6 rounded-xl border border-foreground/10 bg-background hover:border-primary-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-primary-400">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground/90">
                        {skill.name}
                      </span>
                      <span className="text-xs text-foreground/60">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={
                          isInView
                            ? { width: `${skill.level}%` }
                            : { width: 0 }
                        }
                        transition={{
                          delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.3,
                          duration: 0.8,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
