'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, Calendar, ArrowRight } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

export default function Experience() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const getExperiences = () => {
    const items = []
    for (let i = 0; i < 6; i++) {
      items.push({
        company: t(`experience.items.${i}.company`),
        role: t(`experience.items.${i}.role`),
        period: t(`experience.items.${i}.period`),
        achievements: [
          t(`experience.items.${i}.achievements.0`),
          t(`experience.items.${i}.achievements.1`),
          t(`experience.items.${i}.achievements.2`),
          t(`experience.items.${i}.achievements.3`),
        ],
        scale: t(`experience.items.${i}.scale`),
      })
    }
    return items
  }

  const experiences = getExperiences()

  const stackMap: Record<number, string[]> = {
    0: ['TypeScript', 'React', 'Zustand', 'WebSockets', 'Microfrontends'],
    1: ['React', 'TypeScript', 'AWS', 'CodeCommit', 'CodePipeline', 'ECS', 'Amplify'],
    2: ['React', 'TypeScript', 'React Query', 'React Hook Form', 'Microfrontends', 'Microservices'],
    3: ['React', 'TypeScript', 'Salesforce', 'SFCC', 'HubSpot', 'Formik', 'Styled Components'],
    4: ['JavaScript', 'HTML5', 'CSS3', 'IVR', 'SMS', 'Email'],
    5: ['React', 'React Native', 'MeteorJs', 'PWA', 'Service Workers', 'SCRUM'],
  }

  return (
    <section
      id="experience"
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
            {t('experience.title')} <span className="text-primary-400">{t('experience.titleHighlight')}</span>
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('experience.description')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-primary-500 opacity-30" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={exp.company}
                  className="relative"
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <div className={`flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Timeline Dot */}
                    <div className="absolute left-6 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-primary-500 border-4 border-background z-10" />

                    {/* Content Card */}
                    <div className={`md:w-[48%] ${isEven ? 'md:pr-4 md:ml-auto' : 'md:pl-4'}`}>
                      <motion.div
                        className="p-8 rounded-xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-300"
                        whileHover={{ y: -5, borderColor: 'rgba(14, 165, 233, 0.3)' }}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-semibold mb-1">{exp.company}</h3>
                            <p className="text-primary-400 font-medium mb-2">{exp.role}</p>
                            <div className="flex items-center gap-2 text-sm text-foreground/60">
                              <Calendar className="w-4 h-4" />
                              <span>{exp.period}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-foreground/60 mb-3">
                            <strong className="text-foreground/80">{t('experience.scale')}</strong> {exp.scale}
                          </p>
                        </div>

                        <ul className="space-y-3 mb-6">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <ArrowRight className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-foreground/80 leading-relaxed">{achievement}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-2">
                          {(stackMap[index] || []).map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

