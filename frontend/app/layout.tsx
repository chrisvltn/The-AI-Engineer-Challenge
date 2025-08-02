import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Engineer Challenge - Chat Interface',
  description: 'A beautiful chat interface for the AI Engineer Challenge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 