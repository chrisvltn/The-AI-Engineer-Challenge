'use client'

import { useChatContext } from '../context/ChatContext'

export default function AccessibilityAnnouncements() {
  const { announcement } = useChatContext()

  return (
    <>
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sage-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>
    </>
  )
} 