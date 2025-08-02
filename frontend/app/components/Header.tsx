'use client'

import { Bot, Settings } from 'lucide-react'
import { useChatContext } from '../context/ChatContext'

export default function Header() {
  const { showSettings, handleSettingsToggle, settingsButtonRef } = useChatContext()

  return (
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
  )
} 