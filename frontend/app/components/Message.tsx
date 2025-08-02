'use client'

import { memo, useMemo } from 'react'
import { Bot, User } from 'lucide-react'
import { Message as MessageType } from './types'

interface MessageProps {
  message: MessageType
}

const Message = memo(function Message({ message }: MessageProps) {
  // Memoize the formatted timestamp to avoid recalculation on every render
  const formattedTimestamp = useMemo(() => 
    message.timestamp.toLocaleTimeString(), 
    [message.timestamp]
  )

  // Memoize the aria label to avoid string concatenation on every render
  const ariaLabel = useMemo(() => 
    `${message.role === 'user' ? 'Your message' : 'AI response'} at ${formattedTimestamp}`, 
    [message.role, formattedTimestamp]
  )

  if (!message.content) return null

  return (
    <div
      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      role="article"
      aria-label={ariaLabel}
    >
      {message.role === 'ai' && (
        <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs opacity-70 mt-2" aria-label="Message timestamp">
          {formattedTimestamp}
        </p>
      </div>
      {message.role === 'user' && (
        <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
})

export default Message 