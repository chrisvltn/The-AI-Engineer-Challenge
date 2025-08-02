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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: inputMessage,
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

  return (
    <div className="h-screen bg-gradient-to-br from-boho-50 to-boho-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-boho-200 sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-sage-800">AI Engineer Challenge</h1>
              <p className="text-sm text-sage-600">Chat with GPT-4.1-mini</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-secondary"
            type='button'
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white/90 backdrop-blur-sm border-b border-boho-200 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="input-field pr-10"
                />
                <Key className="w-5 h-5 text-sage-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Developer Message (System Prompt)
              </label>
              <textarea
                value={developerMessage}
                onChange={(e) => setDeveloperMessage(e.target.value)}
                placeholder="Enter the system prompt for the AI"
                className="input-field min-h-[80px] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="input-field"
              >
                <option value="gpt-4.1-mini">GPT-4.1-mini</option>
                <option value="gpt-4o-mini">GPT-4o-mini</option>
                <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex-1 flex flex-col min-h-0">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-boho-200 shadow-lg flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-0 h-0">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-sage-700 mb-2">Welcome to AI Engineer Challenge</h3>
                <p className="text-sage-600">Start a conversation by typing a message below</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'ai' && (
                    <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
                         {isLoading && (
               <div className="flex gap-3 justify-start">
                 <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0">
                   <Bot className="w-5 h-5 text-white" />
                 </div>
                 <div className="chat-bubble-ai px-6 py-4">
                   <div className="flex space-x-2">
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
          <div className="p-6 border-t border-boho-200 bg-white/40">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="input-field resize-none min-h-[60px] max-h-[120px] placeholder:text-sage-500"
                  rows={1}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || !apiKey.trim() || isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
            {!apiKey.trim() && (
              <p className="text-sm text-sage-600 mt-2">
                ⚠️ Please enter your OpenAI API key in settings to start chatting
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 