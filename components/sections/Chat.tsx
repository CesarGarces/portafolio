'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { Send, Bot, User, Terminal, Loader2, X, Minimize2, Maximize2 } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          assistantMessage += chunk
          setStreamingContent(assistantMessage)
        }
      }

      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }])
      setStreamingContent('')
    } catch (error) {
      console.error('Error:', error)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: t('chat.error'),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([])
    setStreamingContent('')
  }

  return (
    <section
      id="chat"
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
            {t('chat.title')} <span className="text-primary-400">{t('chat.titleHighlight')}</span>
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            {t('chat.description')}
          </p>
          <motion.button
            onClick={() => setIsOpen(true)}
            className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Terminal className="w-5 h-5" />
            {t('chat.openChat')}
          </motion.button>
        </motion.div>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-4 right-4 z-50 w-full max-w-md"
          >
            <div
              className={`bg-background border border-foreground/10 rounded-lg shadow-2xl overflow-hidden flex flex-col ${
                isMinimized ? 'h-16' : 'h-[600px]'
              } transition-all duration-300`}
            >
              {/* Terminal Header */}
              <div className="bg-foreground/5 border-b border-foreground/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-sm font-mono text-foreground/80">
                    {t('chat.terminalTitle')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="p-1.5 hover:bg-foreground/10 rounded transition-colors"
                      aria-label="Clear chat"
                    >
                      <X className="w-4 h-4 text-foreground/60" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1.5 hover:bg-foreground/10 rounded transition-colors"
                    aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4 text-foreground/60" />
                    ) : (
                      <Minimize2 className="w-4 h-4 text-foreground/60" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-foreground/10 rounded transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-foreground/60" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a] font-mono text-sm">
                    {messages.length === 0 && !isLoading && (
                      <div className="text-foreground/60 text-center py-8">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-primary-400/50" />
                        <p>{t('chat.welcome')}</p>
                        <p className="text-xs mt-2 text-foreground/40">
                          {t('chat.welcomeHint')}
                        </p>
                      </div>
                    )}

                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-6 h-6 rounded bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary-400" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-primary-500/20 text-primary-300'
                              : 'bg-foreground/5 text-foreground/90'
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-6 h-6 rounded bg-foreground/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-foreground/60" />
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {isLoading && streamingContent && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 justify-start"
                      >
                        <div className="w-6 h-6 rounded bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-400" />
                        </div>
                        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-foreground/5 text-foreground/90">
                          <div className="whitespace-pre-wrap break-words">
                            {streamingContent}
                            <span className="inline-block w-2 h-4 bg-primary-400 ml-1 animate-pulse" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {isLoading && !streamingContent && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-6 h-6 rounded bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                          <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
                        </div>
                        <div className="text-foreground/60 text-sm">
                          {t('chat.thinking')}
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-foreground/10 p-4 bg-background">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={t('chat.inputPlaceholder')}
                          disabled={isLoading}
                          className="w-full px-4 py-3 rounded-lg border border-foreground/10 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all font-mono text-sm disabled:opacity-50"
                        />
                      </div>
                      <motion.button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: isLoading ? 1 : 1.05 }}
                        whileTap={{ scale: isLoading ? 1 : 0.95 }}
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
