import { createClient } from './client'
import type { Session } from '@/types'

interface SessionRow {
  id: string
  timestamp: number
  topic: string
  level: string
  article: string
  transcript: string | null
  feedback: string | null
  title: string | null
  messages?: MessageRow[]
}

interface MessageRow {
  role: string
  content: string
  timestamp: number
}

export async function loadSessions(): Promise<Session[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(`
      *,
      messages (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Failed to load sessions:', error)
    return []
  }

  return (sessions || []).map((s: SessionRow) => ({
    id: s.id,
    timestamp: s.timestamp,
    topic: s.topic,
    level: s.level as 'A2' | 'B1' | 'B2' | 'C1',
    article: s.article,
    transcript: s.transcript,
    feedback: s.feedback,
    title: s.title ?? undefined,
    chatMessages: (s.messages || []).map((m: MessageRow) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
      timestamp: m.timestamp,
    })),
  }))
}

export async function saveSession(session: Session): Promise<void> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // セッションを保存または更新
  const { error: sessionError } = await supabase
    .from('sessions')
    .upsert({
      id: session.id,
      user_id: user.id,
      timestamp: session.timestamp,
      topic: session.topic,
      level: session.level,
      article: session.article,
      transcript: session.transcript,
      feedback: session.feedback,
      title: session.title,
      updated_at: new Date().toISOString(),
    })

  if (sessionError) {
    console.error('Failed to save session:', sessionError)
    throw sessionError
  }

  // メッセージを保存
  if (session.chatMessages.length > 0) {
    // 既存のメッセージを削除
    await supabase
      .from('messages')
      .delete()
      .eq('session_id', session.id)

    // 新しいメッセージを挿入
    const messagesToInsert = session.chatMessages.map((msg) => ({
      session_id: session.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }))

    const { error: messagesError } = await supabase
      .from('messages')
      .insert(messagesToInsert)

    if (messagesError) {
      console.error('Failed to save messages:', messagesError)
      throw messagesError
    }
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // メッセージを先に削除（外部キー制約）
  await supabase
    .from('messages')
    .delete()
    .eq('session_id', sessionId)

  // セッションを削除
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete session:', error)
    throw error
  }
}

export async function clearAllSessions(): Promise<void> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // ユーザーの全セッションIDを取得
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id')
    .eq('user_id', user.id)

  if (sessions && sessions.length > 0) {
    const sessionIds = sessions.map(s => s.id)
    
    // メッセージを削除
    await supabase
      .from('messages')
      .delete()
      .in('session_id', sessionIds)

    // セッションを削除
    await supabase
      .from('sessions')
      .delete()
      .eq('user_id', user.id)
  }
}

