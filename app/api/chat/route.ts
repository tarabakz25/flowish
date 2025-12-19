import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { chatPrompt } from '@/lib/prompts'
import type { ChatRequest, ChatResponse } from '@/types'

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json()
    const { message, article, history } = body

    // バリデーション
    if (!message || message.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Invalid message' },
        { status: 400 }
      )
    }

    const level = 'B2' // デフォルト、後でセッションから取得可能にする
    const messages = [
      { role: 'system' as const, content: chatPrompt.system(level) },
      { role: 'user' as const, content: `Article context:\n${article}` },
      ...history.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // gpt-5-miniはまだ利用できないため、gpt-4o-miniを使用
      temperature: 0.8,
      max_tokens: 150,
      messages
    })

    const response: ChatResponse = {
      message: completion.choices[0].message.content || '',
      timestamp: Date.now()
    }

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}



