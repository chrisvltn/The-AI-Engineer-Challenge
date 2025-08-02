'use client'

import { Key } from 'lucide-react'
import { useChatContext } from '../context/ChatContext'

export default function Settings() {
  const { settings, setSettings } = useChatContext()

  const handleChange = (field: keyof typeof settings, value: string) => {
    setSettings({
      ...settings,
      [field]: value
    })
  }

  return (
    <div 
      id="settings-panel"
      className="bg-white/90 backdrop-blur-sm border-b border-boho-200 p-4 flex-shrink-0"
      role="region"
      aria-labelledby="settings-heading"
    >
      <div className="max-w-4xl mx-auto px-0 md:px-4 space-y-4">
        <h2 id="settings-heading" className="sr-only">Settings</h2>
        <div>
          <label htmlFor="api-key-input" className="block text-sm font-medium text-sage-700 mb-2">
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              id="api-key-input"
              type="password"
              value={settings.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="input-field pr-10"
              aria-describedby="api-key-help"
            />
            <Key className="w-5 h-5 text-sage-400 absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true" />
          </div>
          <p id="api-key-help" className="text-sm text-sage-600 mt-1">
            Your API key is stored locally and never sent to our servers
          </p>
        </div>
        <div>
          <label htmlFor="developer-message" className="block text-sm font-medium text-sage-700 mb-2">
            Developer Message (System Prompt)
          </label>
          <textarea
            id="developer-message"
            value={settings.developerMessage}
            onChange={(e) => handleChange('developerMessage', e.target.value)}
            placeholder="Enter the system prompt for the AI"
            className="input-field min-h-[80px] resize-none"
            aria-describedby="developer-message-help"
          />
          <p id="developer-message-help" className="text-sm text-sage-600 mt-1">
            This message sets the behavior and context for the AI assistant
          </p>
        </div>
        <div>
          <label htmlFor="model-select" className="block text-sm font-medium text-sage-700 mb-2">
            Model
          </label>
          <select
            id="model-select"
            value={settings.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className="input-field"
            aria-describedby="model-help"
          >
            <option value="gpt-4.1-mini">GPT-4.1-mini</option>
            <option value="gpt-4o-mini">GPT-4o-mini</option>
            <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
          </select>
          <p id="model-help" className="text-sm text-sage-600 mt-1">
            Choose the AI model for your conversation
          </p>
        </div>
      </div>
    </div>
  )
} 