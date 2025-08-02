'use client'

import { useState, useEffect, useRef } from 'react'
import { Message, ChatSettings } from '../components/types'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<ChatSettings>({
    apiKey: '',
    developerMessage: 'You are a helpful AI assistant.',
    model: 'gpt-4.1-mini'
  })
  const [showSettings, setShowSettings] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const settingsButtonRef = useRef<HTMLButtonElement>(null)

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
    if (!inputMessage.trim() || !settings.apiKey.trim()) return

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
          developer_message: settings.developerMessage,
          user_message: inputMessage,
          chat_history: chatHistory,
          model: settings.model,
          api_key: settings.apiKey
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

  return {
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
  }
} 