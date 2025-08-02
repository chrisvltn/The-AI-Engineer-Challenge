'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Settings, Key } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'ai'
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant.')
  const [model, setModel] = useState('gpt-4.1-mini')
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [announcement, setAnnouncement] = useState('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Announce new messages to screen readers
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.content) {
        setAnnouncement(`${lastMessage.role === 'user' ? 'You said' : 'AI responded'}: ${lastMessage.content}`)
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiKey.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Convert messages to the format expected by the API
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: inputMessage,
          chat_history: chatHistory,
          model: model,
          api_key: apiKey
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let aiResponse = ''
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        aiResponse += chunk

        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: aiResponse }
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, there was an error processing your request. Please check your API key and try again.',
        role: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings)
    // Focus management for settings panel
    if (!showSettings) {
      setTimeout(() => {
        const firstInput = document.querySelector('#api-key-input') as HTMLInputElement
        firstInput?.focus()
      }, 100)
    } else {
      settingsButtonRef.current?.focus()
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-boho-50 to-boho-100 flex flex-col overflow-hidden">
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sage-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-boho-200 sticky top-0 z-10 flex-shrink-0" role="banner">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center" aria-hidden="true">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-sage-800">AI Engineer Challenge</h1>
              <p className="text-sm text-sage-600">Chat with GPT-4.1-mini</p>
            </div>
          </div>
          <button
            ref={settingsButtonRef}
            onClick={handleSettingsToggle}
            className="btn-secondary"
            type="button"
            aria-expanded={showSettings}
            aria-controls="settings-panel"
            aria-label={`${showSettings ? 'Hide' : 'Show'} settings panel`}
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div 
          id="settings-panel"
          className="bg-white/90 backdrop-blur-sm border-b border-boho-200 p-4 flex-shrink-0"
          role="region"
          aria-labelledby="settings-heading"
        >
          <div className="max-w-4xl mx-auto px-0 md:px-4 space-y-4">
            <h2 id="settings-heading" className="sr-only">Settings</h2>
            <div>
              <label htmlFor="api-key-input" className="block text-sm font-medium text-sage-700 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  id="api-key-input"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="input-field pr-10"
                  aria-describedby="api-key-help"
                />
                <Key className="w-5 h-5 text-sage-400 absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true" />
              </div>
              <p id="api-key-help" className="text-sm text-sage-600 mt-1">
                Your API key is stored locally and never sent to our servers
              </p>
            </div>
            <div>
              <label htmlFor="developer-message" className="block text-sm font-medium text-sage-700 mb-2">
                Developer Message (System Prompt)
              </label>
              <textarea
                id="developer-message"
                value={developerMessage}
                onChange={(e) => setDeveloperMessage(e.target.value)}
                placeholder="Enter the system prompt for the AI"
                className="input-field min-h-[80px] resize-none"
                aria-describedby="developer-message-help"
              />
              <p id="developer-message-help" className="text-sm text-sage-600 mt-1">
                This message sets the behavior and context for the AI assistant
              </p>
            </div>
            <div>
              <label htmlFor="model-select" className="block text-sm font-medium text-sage-700 mb-2">
                Model
              </label>
              <select
                id="model-select"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="input-field"
                aria-describedby="model-help"
              >
                <option value="gpt-4.1-mini">GPT-4.1-mini</option>
                <option value="gpt-4o-mini">GPT-4o-mini</option>
                <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
              </select>
              <p id="model-help" className="text-sm text-sage-600 mt-1">
                Choose the AI model for your conversation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <main id="main-content" className="w-full md:max-w-4xl md:mx-auto px-0 md:px-4 md:py-4 py-0 flex-1 flex flex-col min-h-0" role="main">
        <div className="md:bg-white/60 md:backdrop-blur-sm md:rounded-2xl md:border md:border-boho-200 md:shadow-lg flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div 
            className="flex-1 p-2 md:p-6 overflow-y-auto space-y-4 min-h-0 h-0"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.length === 0 ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <Bot className="w-16 h-16 text-sage-400 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-sage-700 mb-2">Welcome to AI Engineer Challenge</h3>
                <p className="text-sage-600">Start a conversation by typing a message below</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  role="article"
                  aria-label={`${message.role === 'user' ? 'Your message' : 'AI response'} at ${message.timestamp.toLocaleTimeString()}`}
                >
                  {message.role === 'ai' && (
                    <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2" aria-label="Message timestamp">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start" role="status" aria-live="polite">
                <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="chat-bubble-ai px-6 py-4">
                  <div className="flex space-x-2" aria-label="AI is typing">
                    <div className="w-3 h-3 bg-sage-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-6 border-t border-boho-200 bg-white/40" role="form" aria-label="Message input">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative flex items-center">
              <label htmlFor="message-input" className="sr-only">Type your message</label>
              <textarea
                ref={inputRef}
                id="message-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="input-field resize-none min-h-[60px] max-h-[120px] placeholder:text-sage-500 pr-12 flex-1"
                rows={1}
                name="message"
                aria-label="Chat message"
                aria-describedby="message-help"
                disabled={!apiKey.trim()}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || !apiKey.trim() || isLoading}
                className="absolute right-3 w-8 h-8 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-400 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
                aria-label="Send message"
                aria-describedby="send-help"
              >
                <Send className="w-4 h-4 text-white" aria-hidden="true" />
              </button>
            </form>
            <div id="message-help" className="text-sm text-sage-600 mt-2">
              {!apiKey.trim() ? (
                <p role="alert">
                  ⚠️ Please enter your OpenAI API key in settings to start chatting
                </p>
              ) : (
                <p>Press Enter to send, Shift+Enter for new line</p>
              )}
            </div>
            <div id="send-help" className="sr-only">
              Click to send your message
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 