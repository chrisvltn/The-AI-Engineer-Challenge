'use client'

import { useChatContext } from '../context/ChatContext'
import Settings from './Settings'

export default function SettingsWrapper() {
  const { showSettings } = useChatContext()

  if (!showSettings) {
    return null
  }

  return <Settings />
} 