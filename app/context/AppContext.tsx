'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Session, CEFRLevel, Message, AppError } from '@/types'
import { toast } from 'sonner'

type AppContextType = {
  // Session管理
  currentSession: Session | null
  createNewSession: (topic: string, level: CEFRLevel) => void
  loadSession: (sessionId: string) => void
  updateArticle: (article: string) => void
  addChatMessage: (message: Message) => void
  updateTranscript: (transcript: string) => void
  updateFeedback: (feedback: string) => void
  
  // UI状態
  isGeneratingArticle: boolean
  isSendingMessage: boolean
  isRecording: boolean
  isTranscribing: boolean
  isGeneratingFeedback: boolean
  setIsGeneratingArticle: (value: boolean) => void
  setIsSendingMessage: (value: boolean) => void
  setIsRecording: (value: boolean) => void
  setIsTranscribing: (value: boolean) => void
  setIsGeneratingFeedback: (value: boolean) => void
  
  // エラー
  error: AppError | null
  setError: (error: AppError | null) => void
  clearError: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  // セッション作成
  const createNewSession = useCallback((topic: string, level: CEFRLevel) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      topic,
      level,
      article: '',
      chatMessages: [],
      transcript: null,
      feedback: null,
    }
    setCurrentSession(newSession)
    setError(null)
  }, [])

  // セッション読み込み
  const loadSession = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch('/api/sessions')
      const result = await response.json()

      if (result.success) {
        const session = result.data.find((s: Session) => s.id === sessionId)
        if (session) {
          setCurrentSession(session)
          setError(null)
          // トップにスクロール
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          toast.error('セッションが見つかりませんでした')
        }
      } else {
        toast.error('セッションの読み込みに失敗しました')
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      toast.error('セッションの読み込みに失敗しました')
    }
  }, [])

  // 記事更新
  const updateArticle = useCallback(async (article: string) => {
    if (!currentSession) return
    
    const updated: Session = {
      ...currentSession,
      article,
      chatMessages: [], // 記事生成時はチャット履歴をクリア
      transcript: null,
      feedback: null,
    }
    setCurrentSession(updated)
    
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      const result = await response.json()
      if (!result.success) {
        console.error('Failed to save session:', result.error)
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }, [currentSession])

  // チャットメッセージ追加
  const addChatMessage = useCallback(async (message: Message) => {
    if (!currentSession) return
    
    const updated: Session = {
      ...currentSession,
      chatMessages: [...currentSession.chatMessages, message],
    }
    setCurrentSession(updated)
    
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      const result = await response.json()
      if (!result.success) {
        console.error('Failed to save session:', result.error)
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }, [currentSession])

  // トランスクリプト更新
  const updateTranscript = useCallback(async (transcript: string) => {
    if (!currentSession) return
    
    const updated: Session = {
      ...currentSession,
      transcript,
    }
    setCurrentSession(updated)
    
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      const result = await response.json()
      if (!result.success) {
        console.error('Failed to save session:', result.error)
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }, [currentSession])

  // フィードバック更新
  const updateFeedback = useCallback(async (feedback: string) => {
    if (!currentSession) return
    
    const updated: Session = {
      ...currentSession,
      feedback,
    }
    setCurrentSession(updated)
    
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      const result = await response.json()
      if (!result.success) {
        console.error('Failed to save session:', result.error)
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }, [currentSession])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // URLパラメータからセッションを読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const sessionId = params.get('session')
      if (sessionId && !currentSession) {
        void loadSession(sessionId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentSession,
        createNewSession,
        loadSession,
        updateArticle,
        addChatMessage,
        updateTranscript,
        updateFeedback,
        isGeneratingArticle,
        isSendingMessage,
        isRecording,
        isTranscribing,
        isGeneratingFeedback,
        setIsGeneratingArticle,
        setIsSendingMessage,
        setIsRecording,
        setIsTranscribing,
        setIsGeneratingFeedback,
        error,
        setError,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

