import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
      return NextResponse.json(
        { success: false, error: 'Failed to load sessions' },
        { status: 500 }
      )
    }

    const formattedSessions: Session[] = (sessions || []).map((s: SessionRow) => ({
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

    return NextResponse.json({
      success: true,
      data: formattedSessions,
    })
  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: Session = await request.json()

    // セッションを保存または更新
    const { error: sessionError } = await supabase
      .from('sessions')
      .upsert({
        id: body.id,
        user_id: user.id,
        timestamp: body.timestamp,
        topic: body.topic,
        level: body.level,
        article: body.article,
        transcript: body.transcript,
        feedback: body.feedback,
        title: body.title,
        updated_at: new Date().toISOString(),
      })

    if (sessionError) {
      console.error('Failed to save session:', sessionError)
      return NextResponse.json(
        { success: false, error: 'Failed to save session' },
        { status: 500 }
      )
    }

    // メッセージを保存
    if (body.chatMessages.length > 0) {
      // 既存のメッセージを削除
      await supabase
        .from('messages')
        .delete()
        .eq('session_id', body.id)

      // 新しいメッセージを挿入
      const messagesToInsert = body.chatMessages.map((msg) => ({
        session_id: body.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }))

      const { error: messagesError } = await supabase
        .from('messages')
        .insert(messagesToInsert)

      if (messagesError) {
        console.error('Failed to save messages:', messagesError)
        return NextResponse.json(
          { success: false, error: 'Failed to save messages' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: { id: body.id },
    })
  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
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
      return NextResponse.json(
        { success: false, error: 'Failed to delete session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

