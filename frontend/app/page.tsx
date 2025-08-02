'use client'

import { ChatProvider } from './context/ChatContext'
import Header from './components/Header'
import SettingsWrapper from './components/SettingsWrapper'
import ChatContainer from './components/ChatContainer'
import AccessibilityAnnouncements from './components/AccessibilityAnnouncements'

export default function Home() {
  return (
    <ChatProvider>
      <div className="h-screen bg-gradient-to-br from-boho-50 to-boho-100 flex flex-col overflow-hidden">
        <AccessibilityAnnouncements />
        
        <Header />

        <SettingsWrapper />

        <ChatContainer />
      </div>
    </ChatProvider>
  )
} 