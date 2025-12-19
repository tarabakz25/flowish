// CEFR レベル
export type CEFRLevel = 'A2' | 'B1' | 'B2' | 'C1'

// チャットメッセージ
export type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// セッション
export type Session = {
  id: string
  timestamp: number
  topic: string
  level: CEFRLevel
  article: string
  chatMessages: Message[]
  transcript: string | null
  feedback: string | null
  title?: string // Phase 3: gpt-5-nano生成
}

// セッション履歴
export type SessionHistory = {
  sessions: Session[]
}

// エラー型
export type AppError = {
  type: 'network' | 'api' | 'validation' | 'permission' | 'storage'
  message: string
  retryable: boolean
  details?: unknown
}

// API レスポンス
export type APIResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

// API リクエスト型
export type GenerateArticleRequest = {
  topic: string
  level: CEFRLevel
}

export type GenerateArticleResponse = {
  article: string
  wordCount: number
  estimatedReadTime: number
}

export type ChatRequest = {
  message: string
  article: string
  history: Message[]
}

export type ChatResponse = {
  message: string
  timestamp: number
}

export type STTResponse = {
  transcript: string
  duration: number
}

export type FeedbackRequest = {
  transcript: string
  article: string
  level: CEFRLevel
}

export type FeedbackResponse = {
  feedback: string
  sections: {
    pronunciation: string
    stress: string
    expression: string
    practice: string[]
  }
}

// Phase 3
export type SuggestTopicsResponse = {
  suggestions: string[]
}

export type PolishTextResponse = {
  polished: string
  changes: string[]
}

export type GenerateTitleResponse = {
  title: string
}



