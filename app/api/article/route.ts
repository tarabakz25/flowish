import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { articlePrompt } from '@/lib/prompts'
import type { GenerateArticleRequest, GenerateArticleResponse } from '@/types'

export async function POST(request: Request) {
  try {
    const body: GenerateArticleRequest = await request.json()
    const { topic, level } = body

    // バリデーション
    if (!topic || topic.length < 2 || topic.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Invalid topic length' },
        { status: 400 }
      )
    }

    if (!['A2', 'B1', 'B2', 'C1'].includes(level)) {
      return NextResponse.json(
        { success: false, error: 'Invalid level' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // gpt-5はまだ利用できないため、gpt-4oを使用
      temperature: 0.7,
      max_tokens: 600,
      messages: [
        { role: 'system', content: articlePrompt.system },
        { role: 'user', content: articlePrompt.user(topic, level) }
      ]
    })

    const article = completion.choices[0].message.content || ''
    const wordCount = article.split(/\s+/).length
    const estimatedReadTime = Math.ceil(wordCount / 200) // 200 wpm

    const response: GenerateArticleResponse = {
      article,
      wordCount,
      estimatedReadTime
    }

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Article generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate article' },
      { status: 500 }
    )
  }
}

