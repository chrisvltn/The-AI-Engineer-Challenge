'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Message, ChatSettings } from '../components/types'
import { useChat } from '../hooks/useChat'

interface ChatContextType {
  // State
  messages: Message[]
  inputMessage: string
  isLoading: boolean
  settings: ChatSettings
  showSettings: boolean
  announcement: string
  
  // Actions
  setInputMessage: (message: string) => void
  setSettings: (settings: ChatSettings) => void
  handleSendMessage: () => Promise<void>
  handleSettingsToggle: () => void
  
  // Refs
  settingsButtonRef: React.RefObject<HTMLButtonElement>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    settings,
    setSettings,
    showSettings,
    announcement,
    settingsButtonRef,
    handleSendMessage,
    handleSettingsToggle
  } = useChat()

  const value: ChatContextType = {
    messages,
    inputMessage,
    isLoading,
    settings,
    showSettings,
    announcement,
    setInputMessage,
    setSettings,
    handleSendMessage,
    handleSettingsToggle,
    settingsButtonRef
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
} 