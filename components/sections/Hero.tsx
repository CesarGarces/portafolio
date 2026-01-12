'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Code } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useI18n } from '@/contexts/I18nContext'

// Apple-style easing curves
const appleEase = [0.25, 0.46, 0.45, 0.94] // Smooth, premium feel
const appleEaseOut = [0.16, 1, 0.3, 1] // Elegant exit

// Text reveal animation (Apple-style)
const textRevealVariants = {
  hidden: {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: appleEase,
    },
  },
}

// Badge animation (scale + fade with spring)
const badgeVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
    rotate: -180,
  },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      delay: 0.3,
    },
  },
}

// Title line animation (staggered reveal)
const titleLineVariants = {
  hidden: {
    y: 100,
    opacity: 0,
    filter: 'blur(20px)',
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.0,
      delay: 0.5 + i * 0.15,
      ease: appleEase,
    },
  }),
}

// Description animation
const descriptionVariants = {
  hidden: {
    y: 30,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.0,
      delay: 1.1,
      ease: appleEase,
    },
  },
}

// CTA buttons animation
const ctaVariants = {
  hidden: {
    y: 40,
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 1.4,
      ease: appleEase,
    },
  },
}

// Stats animation
const statsVariants = {
  hidden: {
    y: 30,
    opacity: 0,
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 1.8 + i * 0.1,
      ease: appleEase,
    },
  }),
}

// Particle component for Apple-style background effect
function Particle({ delay = 0, index = 0 }: { delay?: number; index?: number }) {
  // Use deterministic values based on index to avoid hydration mismatch
  // Simple hash function for pseudo-random but consistent values
  const hash = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const size = hash(index * 0.1) * 4 + 2
  const x = hash(index * 0.3) * 100
  const y = hash(index * 0.7) * 100
  const duration = hash(index * 0.5) * 20 + 15
  const xOffset = hash(index * 0.9) * 50 - 25

  return (
    <motion.div
      className="absolute rounded-full bg-primary-400/20"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={{
        y: [0, -50, 0],
        x: [0, xOffset, 0],
        opacity: [0, 0.6, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export default function Hero() {
  const { t } = useI18n()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  })

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToProjects = () => {
    const element = document.querySelector('#projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Generate particles with deterministic values
  const particles = Array.from({ length: 20 }, (_, i) => (
    <Particle key={i} delay={i * 0.5} index={i} />
  ))

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden w-full"
    >
      {/* Animated Background Layers - Apple style */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY, opacity }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary-900/30" />

        {/* Animated radial gradient (follows mouse) */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 0.5}% ${50 + mousePosition.y * 0.5}%, rgba(14, 165, 233, 0.2) 0%, transparent 60%)`,
          }}
          animate={{
            background: [
              `radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.2) 0%, transparent 60%)`,
              `radial-gradient(circle at 55% 45%, rgba(14, 165, 233, 0.25) 0%, transparent 60%)`,
              `radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.2) 0%, transparent 60%)`,
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Secondary animated gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${30 + mousePosition.x * 0.3}% ${70 + mousePosition.y * 0.3}%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
          }}
          animate={{
            background: [
              `radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
              `radial-gradient(circle at 35% 65%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)`,
              `radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles}
        </div>

        {/* Grid Pattern with subtle animation */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 0.2}% ${50 + mousePosition.y * 0.2}%, rgba(14, 165, 233, 0.1) 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial="hidden"
        animate="visible"
      >
        {/* Badge - Apple style reveal */}
        <motion.div
          variants={badgeVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Code className="w-4 h-4 text-primary-400" />
          </motion.div>
          <span className="text-sm text-primary-300 font-medium">{t('hero.badge')}</span>
        </motion.div>

        {/* Title with reveal animation */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance overflow-hidden">
          <motion.span
            className="block"
            custom={0}
            variants={titleLineVariants}
            initial="hidden"
            animate="visible"
          >
            César Garcés
          </motion.span>
          <motion.span
            className="block bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent bg-[length:200%_auto]"
            custom={1}
            variants={titleLineVariants}
            initial="hidden"
            animate="visible"
            style={{
              backgroundPosition: '0% center',
            }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% center', '100% center', '0% center'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {t('hero.subtitle')}
            </motion.span>
          </motion.span>
          <motion.span
            className="block"
            custom={2}
            variants={titleLineVariants}
            initial="hidden"
            animate="visible"
          >
            {t('hero.subtitle2')}
          </motion.span>
        </h1>

        {/* Description with fade + blur */}
        <motion.p
          variants={descriptionVariants}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto mb-12 text-balance"
        >
          {t('hero.description')}
          <br className="hidden sm:block" />
          {t('hero.description2')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={scrollToProjects}
            className="group relative px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all duration-300 overflow-hidden shadow-lg shadow-primary-500/20"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(14, 165, 233, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('hero.ctaProjects')}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown className="w-4 h-4" />
              </motion.div>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: appleEase }}
            />
          </motion.button>

          <motion.a
            href="#contact"
            className="px-8 py-4 border border-foreground/20 hover:border-primary-500/50 text-foreground rounded-lg font-medium transition-all duration-300 backdrop-blur-sm bg-background/50"
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(14, 165, 233, 0.5)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {t('hero.ctaContact')}
          </motion.a>
        </motion.div>

        {/* Stats with staggered reveal */}
        <motion.div
          className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { labelKey: 'hero.stats.years', value: '8+' },
            { labelKey: 'hero.stats.projects', value: '20+' },
            { labelKey: 'hero.stats.teams', value: '5+' },
          ].map((stat, index) => (
            <motion.div
              key={stat.labelKey}
              custom={index}
              variants={statsVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div
                className="text-3xl font-bold text-primary-400 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 1.8 + index * 0.1 + 0.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-foreground/60">{t(stat.labelKey)}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Apple style */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [0, 10, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 2.5,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ArrowDown className="w-6 h-6 text-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
