import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Engineer Challenge - Chat Interface',
  description: 'A beautiful and accessible chat interface for the AI Engineer Challenge',
  keywords: ['AI', 'chat', 'accessibility', 'GPT', 'OpenAI'],
  authors: [{ name: 'AI Engineer Challenge' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'AI Engineer Challenge - Chat Interface',
    description: 'A beautiful and accessible chat interface for the AI Engineer Challenge',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Engineer Challenge - Chat Interface',
    description: 'A beautiful and accessible chat interface for the AI Engineer Challenge',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#059669" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 