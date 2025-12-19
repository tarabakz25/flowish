import type { Session, SessionHistory } from '@/types'

const STORAGE_KEY = 'personal-english-lab-sessions'
const MAX_SESSIONS = 5

export function loadSessions(): Session[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const data: SessionHistory = JSON.parse(stored)
    return data.sessions || []
  } catch (error) {
    console.error('Failed to load sessions:', error)
    return []
  }
}

export function saveSession(session: Session): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const sessions = loadSessions()
    
    // 既存のセッションを更新、または新規追加
    const existingIndex = sessions.findIndex(s => s.id === session.id)
    if (existingIndex >= 0) {
      sessions[existingIndex] = session
    } else {
      sessions.unshift(session)
    }

    // 最新5件のみ保持
    const trimmedSessions = sessions.slice(0, MAX_SESSIONS)

    const data: SessionHistory = {
      sessions: trimmedSessions
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save session:', error)
    // localStorage満杯の場合、古いセッションを削除してリトライ
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      try {
        const sessions = loadSessions()
        if (sessions.length > 0) {
          sessions.pop() // 最古を削除
          const data: SessionHistory = { sessions }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
          saveSession(session) // 再試行
        }
      } catch (retryError) {
        console.error('Failed to retry save:', retryError)
      }
    }
  }
}

export function deleteSession(sessionId: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const sessions = loadSessions()
    const filtered = sessions.filter(s => s.id !== sessionId)
    
    const data: SessionHistory = {
      sessions: filtered
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to delete session:', error)
  }
}

export function clearAllSessions(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear sessions:', error)
  }
}



