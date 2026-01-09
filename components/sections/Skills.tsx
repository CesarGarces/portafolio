'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useI18n } from '@/contexts/I18nContext'

const skillCategories = [
  {
    title: 'Frontend Core',
    skills: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'React Native', level: 85 },
      { name: 'HTML/CSS', level: 95 },
    ],
  },
  {
    title: 'State Management',
    skills: [
      { name: 'Zustand', level: 90 },
      { name: 'Redux Toolkit', level: 90 },
      { name: 'Redux Sagas', level: 85 },
      { name: 'React Query', level: 85 },
    ],
  },
  {
    title: 'Arquitectura',
    skills: [
      { name: 'Clean Architecture', level: 90 },
      { name: 'Microfrontends', level: 85 },
      { name: 'Monorepos (Turborepo/Nx)', level: 85 },
      { name: 'Design Systems', level: 85 },
    ],
  },
  {
    title: 'Testing & Quality',
    skills: [
      { name: 'Jest', level: 90 },
      { name: 'React Testing Library', level: 90 },
      { name: 'Unit Testing', level: 90 },
      { name: 'E2E Testing', level: 75 },
    ],
  },
  {
    title: 'DevOps & Cloud',
    skills: [
      { name: 'AWS (CodeCommit/CodeBuild)', level: 80 },
      { name: 'CI/CD Pipelines', level: 85 },
      { name: 'Docker', level: 80 },
      { name: 'Load Balancers', level: 75 },
    ],
  },
  {
    title: 'Performance & Observability',
    skills: [
      { name: 'Performance Optimization', level: 90 },
      { name: 'Frontend Observability', level: 85 },
      { name: 'Bundle Optimization', level: 85 },
      { name: 'Core Web Vitals', level: 90 },
    ],
  },
]

export default function Skills() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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
