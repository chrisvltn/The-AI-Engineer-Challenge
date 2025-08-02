'use client'

import { useRef, useEffect } from 'react'
import { Bot } from 'lucide-react'
import { useChatContext } from '../context/ChatContext'
import Message from './Message'

export default function MessageList() {
  const { messages, isLoading } = useChatContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
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
          <Message key={message.id} message={message} />
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
  )
} 