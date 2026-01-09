import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { I18nProvider } from '@/contexts/I18nContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'César Garcés | Senior Frontend Engineer',
  description: 'Senior Frontend Engineer with 8+ years of experience building scalable, high-performance applications. Expert in React, TypeScript, and modern frontend architecture.',
  keywords: ['Frontend Engineer', 'React', 'TypeScript', 'Next.js', 'Software Engineer', 'Web Development'],
  authors: [{ name: 'César Garcés' }],
  openGraph: {
    title: 'César Garcés | Senior Frontend Engineer',
    description: 'Senior Frontend Engineer with 8+ years of experience building scalable, high-performance applications.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'César Garcés | Senior Frontend Engineer',
    description: 'Senior Frontend Engineer with 8+ years of experience building scalable, high-performance applications.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
