'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Session, CEFRLevel, Message, AppError } from '@/types'
import { loadSessions, saveSession } from '@/utils/storage'

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
  const loadSession = useCallback((sessionId: string) => {
    const sessions = loadSessions()
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
      setError(null)
      // トップにスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // 記事更新
  const updateArticle = useCallback((article: string) => {
    if (!currentSession) return
    
    const updated: Session = {
      ...currentSession,
      article,
      chatMessages: [], // 記事生成時はチャット履歴をクリア
      transcript: null,
      feedback: null,
    }
    setCurrentSession(updated)
    saveSession(updated)
    // セッション保存の通知は自動保存なので控えめに（Phase 2で実装）
  }, [currentSession])

  // チャットメッセージ追加
  const addChatMessage = useCallback((message: Message) => {
    if (!currentSession) return
    
    const updated: Session = {
      ...currentSession,
      chatMessages: [...currentSession.chatMessages, message],
    }
    setCurrentSession(updated)
    saveSession(updated)
  }, [currentSession])

  // トランスクリプト更新
  const updateTranscript = useCallback((transcript: string) => {
    if (!currentSession) return
    
    const updated: Session = {
      ...currentSession,
      transcript,
    }
    setCurrentSession(updated)
    saveSession(updated)
  }, [currentSession])

  // フィードバック更新
  const updateFeedback = useCallback((feedback: string) => {
    if (!currentSession) return
    
    const updated: Session = {
      ...currentSession,
      feedback,
    }
    setCurrentSession(updated)
    saveSession(updated)
    // セッション保存の通知は自動保存なので控えめに（Phase 2で実装）
  }, [currentSession])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // 初期化時にlocalStorageから最新セッションを読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessions = loadSessions()
      // 最新のセッションを読み込む（オプション）
      // 今回は空の状態から開始するため、コメントアウト
      // if (sessions.length > 0 && !currentSession) {
      //   setCurrentSession(sessions[0])
      // }
    }
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

