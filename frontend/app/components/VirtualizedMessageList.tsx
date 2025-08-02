'use client'

import { useRef, useEffect, useCallback, useMemo, useState } from 'react'
import { Bot } from 'lucide-react'
import { useChatContext } from '../context/ChatContext'
import Message from './Message'

interface VirtualizedMessageListProps {
  itemHeight?: number
  overscan?: number
}

export default function VirtualizedMessageList({ 
  itemHeight = 120, 
  overscan = 5 
}: VirtualizedMessageListProps) {
  const { messages, isLoading, throttledScroll } = useChatContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  // Calculate visible range
  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + overscan,
    messages.length
  )
  const startIndex = Math.max(0, visibleStart - overscan)

  // Memoize visible messages
  const visibleMessages = useMemo(() => 
    messages.slice(startIndex, visibleEnd), 
    [messages, startIndex, visibleEnd]
  )

  // Calculate transform for virtual positioning
  const transformY = startIndex * itemHeight

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      throttledScroll()
    }
  }, [messages.length, throttledScroll])

  // Memoize the empty state
  const emptyState = useMemo(() => (
    <div className="text-center py-12" role="status" aria-live="polite">
      <Bot className="w-16 h-16 text-sage-400 mx-auto mb-4" aria-hidden="true" />
      <h3 className="text-lg font-medium text-sage-700 mb-2">Welcome to AI Engineer Challenge</h3>
      <p className="text-sage-600">Start a conversation by typing a message below</p>
    </div>
  ), [])

  // Memoize the loading indicator
  const loadingIndicator = useMemo(() => (
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
  ), [])

  // Use virtual scrolling only for large message lists
  const shouldUseVirtualization = messages.length > 50

  if (!shouldUseVirtualization) {
    return (
      <div 
        ref={containerRef}
        className="flex-1 p-2 md:p-6 overflow-y-auto space-y-4 min-h-0 h-0"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-atomic="false"
        onScroll={handleScroll}
      >
        {messages.length === 0 ? emptyState : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
        {isLoading && loadingIndicator}
        <div data-messages-end />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 p-2 md:p-6 overflow-y-auto min-h-0 h-0"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-atomic="false"
      onScroll={handleScroll}
    >
      {messages.length === 0 ? emptyState : (
        <>
          <div style={{ height: `${messages.length * itemHeight}px`, position: 'relative' }}>
            <div style={{ transform: `translateY(${transformY}px)` }}>
              {visibleMessages.map((message, index) => (
                <div key={message.id} style={{ height: `${itemHeight}px` }}>
                  <Message message={message} />
                </div>
              ))}
            </div>
          </div>
          {isLoading && loadingIndicator}
        </>
      )}
      <div data-messages-end />
    </div>
  )
} 