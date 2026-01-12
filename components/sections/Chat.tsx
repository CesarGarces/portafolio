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
  const { t, locale } = useI18n()
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

  const handleCommand = (command: string): boolean => {
    const cmd = command.toLowerCase().trim()

    // Solo 'clear' se maneja localmente
    if (cmd === 'clear') {
      clearChat()
      return true // Indica que fue manejado localmente
    }

    // Los demás comandos (help, about, skills, philosophy) se envían a la IA
    return false
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userInput = input.trim()

    // Verificar si es comando local (solo 'clear')
    if (handleCommand(userInput)) {
      setInput('')
      return
    }

    // Todo lo demás (comandos help/about/skills/philosophy o preguntas normales) va a la IA
    const userMessage: Message = { role: 'user', content: userInput }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, locale }),
      })

      if (!response.ok) {
        throw new Error('Error in the response from the API')
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
      console.error('Error in the chat API:', error)
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
            className="fixed sm:inset-auto sm:bottom-4 sm:right-4 z-50 sm:w-full sm:max-w-md"
            style={{
              top: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
              bottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
              left: 'max(0.5rem, env(safe-area-inset-left, 0.5rem))',
              right: 'max(0.5rem, env(safe-area-inset-right, 0.5rem))',
              width: 'calc(100vw - max(0.5rem, env(safe-area-inset-left, 0.5rem)) - max(0.5rem, env(safe-area-inset-right, 0.5rem)))',
            }}
          >
            <div
              className={`bg-background border border-foreground/10 rounded-lg shadow-2xl overflow-hidden flex flex-col ${isMinimized ? 'h-14 sm:h-16' : 'sm:h-[600px]'
                } transition-all duration-300`}
              style={
                !isMinimized
                  ? {
                    height: 'calc(100vh - max(0.5rem, env(safe-area-inset-top, 0.5rem)) - max(0.5rem, env(safe-area-inset-bottom, 0.5rem)))',
                  }
                  : undefined
              }
            >
              {/* Terminal Header */}
              <div className="bg-foreground/5 border-b border-foreground/10 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-mono text-foreground/80 truncate">
                    {t('chat.terminalTitle')}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {messages.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="p-1.5 sm:p-1.5 hover:bg-foreground/10 active:bg-foreground/20 rounded transition-colors touch-manipulation"
                      aria-label="Clear chat"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/60" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1.5 sm:p-1.5 hover:bg-foreground/10 active:bg-foreground/20 rounded transition-colors touch-manipulation"
                    aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/60" />
                    ) : (
                      <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/60" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 sm:p-1.5 hover:bg-foreground/10 active:bg-foreground/20 rounded transition-colors touch-manipulation"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/60" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-[#0a0a0a] font-mono text-xs sm:text-sm">
                    {messages.length === 0 && !isLoading && (
                      <div className="text-foreground/60 text-center py-6 sm:py-8 px-2">
                        <Bot className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary-400/50" />
                        <p className="text-sm sm:text-base">{t('chat.welcome')}</p>
                        <p className="text-xs mt-2 text-foreground/40 px-2">
                          {t('chat.welcomeHint')}
                        </p>
                        <div className="text-xs sm:text-sm mt-4 text-foreground/40">
                          <p className="mb-2 text-foreground/60 text-left">{t('chat.commands.title')}</p>
                          <ul className="space-y-1 text-left">
                            <li className="flex items-start gap-2">
                              <span className="text-primary-400">$</span>
                              <span>
                                <span className="text-primary-300">help</span> → {t('chat.commands.help')}
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-400">$</span>
                              <span>
                                <span className="text-primary-300">about</span> → {t('chat.commands.about')}
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-400">$</span>
                              <span>
                                <span className="text-primary-300">skills</span> → {t('chat.commands.skills')}
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-400">$</span>
                              <span>
                                <span className="text-primary-300">philosophy</span> → {t('chat.commands.philosophy')}
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-400">$</span>
                              <span>
                                <span className="text-primary-300">clear</span> → {t('chat.commands.clear')}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${message.role === 'user'
                            ? 'bg-primary-500/20 text-primary-300'
                            : 'bg-foreground/5 text-foreground/90'
                            }`}
                        >
                          <div className="whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-foreground/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/60" />
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {isLoading && streamingContent && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 sm:gap-3 justify-start"
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400" />
                        </div>
                        <div className="max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 bg-foreground/5 text-foreground/90">
                          <div className="whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed">
                            {streamingContent}
                            <span className="inline-block w-1.5 h-3.5 sm:w-2 sm:h-4 bg-primary-400 ml-1 animate-pulse" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {isLoading && !streamingContent && (
                      <div className="flex gap-2 sm:gap-3 justify-start">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400 animate-spin" />
                        </div>
                        <div className="text-foreground/60 text-xs sm:text-sm">
                          {t('chat.thinking')}
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-foreground/10 p-3 sm:p-4 bg-background">
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
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-foreground/10 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all font-mono text-xs sm:text-sm disabled:opacity-50"
                        />
                      </div>
                      <motion.button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2.5 sm:px-6 sm:py-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-w-[44px] sm:min-w-[auto]"
                        whileHover={{ scale: isLoading ? 1 : 1.05 }}
                        whileTap={{ scale: isLoading ? 1 : 0.95 }}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
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
