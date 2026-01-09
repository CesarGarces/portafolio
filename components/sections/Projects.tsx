'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, Github, Code, Zap, Users } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

export default function Projects() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const getProjects = () => {
    const items = []
    for (let i = 0; i < 4; i++) {
      items.push({
        title: t(`projects.items.${i}.title`),
        problem: t(`projects.items.${i}.problem`),
        solution: t(`projects.items.${i}.solution`),
        highlights: [
          t(`projects.items.${i}.highlights.0`),
          t(`projects.items.${i}.highlights.1`),
          t(`projects.items.${i}.highlights.2`),
          t(`projects.items.${i}.highlights.3`),
        ],
        architecture: t(`projects.items.${i}.architecture`),
        impact: t(`projects.items.${i}.impact`),
      })
    }
    return items
  }

  const projects = getProjects()

  const stackMap: Record<number, string[]> = {
    0: ['Next.js', 'TypeScript', 'Zustand', 'Module Federation', 'AWS CloudFront', 'Redis'],
    1: ['React', 'TypeScript', 'Redux Toolkit', 'Sagas', 'WebSockets', 'D3.js', 'Node.js'],
    2: ['React Native', 'TypeScript', 'Redux Toolkit', 'Firebase', 'GraphQL', 'Fastlane'],
    3: ['React', 'Node.js', 'WebSockets', 'Redis', 'AWS SQS', 'TypeScript'],
  }

  return (
    <section
      id="projects"
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
            {t('projects.title')} <span className="text-primary-400">{t('projects.titleHighlight')}</span>
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('projects.description')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="h-full p-8 rounded-xl border border-foreground/10 bg-background hover:border-primary-500/30 transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center">
                    <Code className="w-6 h-6 text-primary-400" />
                  </div>
                  <motion.div
                    className="flex gap-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center hover:bg-primary-500/10 transition-colors cursor-pointer">
                      <ExternalLink className="w-4 h-4 text-foreground/60" />
                    </div>
                  </motion.div>
                </div>

                <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>

                <div className="mb-6 space-y-4 flex-1">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/60 mb-2">{t('projects.problem')}</h4>
                    <p className="text-foreground/80 text-sm leading-relaxed">{project.problem}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground/60 mb-2">{t('projects.solution')}</h4>
                    <p className="text-foreground/80 text-sm leading-relaxed">{project.solution}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground/60 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {t('projects.highlights')}
                    </h4>
                    <ul className="space-y-2">
                      {project.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                          <span className="text-primary-400 mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground/60 mb-2">{t('projects.architecture')}</h4>
                    <p className="text-foreground/80 text-sm leading-relaxed">{project.architecture}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-primary-500/5 border border-primary-500/10">
                    <p className="text-sm">
                      <strong className="text-primary-400">{t('projects.impact')}</strong>{' '}
                      <span className="text-foreground/80">{project.impact}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-6 border-t border-foreground/10">
                  {(stackMap[index] || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full bg-foreground/5 text-foreground/70 border border-foreground/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

