export interface Message {
  id: string
  content: string
  role: 'user' | 'ai'
  timestamp: Date
}

export interface ChatSettings {
  apiKey: string
  developerMessage: string
  model: string
} 