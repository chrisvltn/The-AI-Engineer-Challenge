'use client'

import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatContainer() {
  return (
    <main id="main-content" className="w-full md:max-w-4xl md:mx-auto px-0 md:px-4 md:py-4 py-0 flex-1 flex flex-col min-h-0" role="main">
      <div className="md:bg-white/60 md:backdrop-blur-sm md:rounded-2xl md:border md:border-boho-200 md:shadow-lg flex-1 flex flex-col min-h-0">
        <MessageList />
        <MessageInput />
      </div>
    </main>
  )
} 