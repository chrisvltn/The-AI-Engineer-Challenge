import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Engineer Challenge - Chat Interface',
  description: 'A beautiful and accessible chat interface for the AI Engineer Challenge',
  keywords: ['AI', 'chat', 'accessibility', 'GPT', 'OpenAI'],
  authors: [{ name: 'AI Engineer Challenge' }],
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

export const viewport: Viewport = { 
  width: "device-width", 
  initialScale: 1,
  themeColor: '#059669',
  colorScheme: 'light dark',
  viewportFit: 'cover',
  userScalable: false,
  minimumScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 