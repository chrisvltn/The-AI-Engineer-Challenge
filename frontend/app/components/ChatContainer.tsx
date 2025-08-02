'use client'

import { useMemo } from 'react'
import { useChatContext } from '../context/ChatContext'
import MessageList from './MessageList'
import VirtualizedMessageList from './VirtualizedMessageList'
import MessageInput from './MessageInput'

export default function ChatContainer() {
  const { messages } = useChatContext()

  // Use virtualized list for large message lists
  const shouldUseVirtualization = useMemo(() => messages.length > 50, [messages.length])

  return (
    <main id="main-content" className="w-full md:max-w-4xl md:mx-auto px-0 md:px-4 md:py-4 py-0 flex-1 flex flex-col min-h-0" role="main">
      <div className="md:bg-white/60 md:backdrop-blur-sm md:rounded-2xl md:border md:border-boho-200 md:shadow-lg flex-1 flex flex-col min-h-0">
        {shouldUseVirtualization ? <VirtualizedMessageList /> : <MessageList />}
        <MessageInput />
      </div>
    </main>
  )
} 