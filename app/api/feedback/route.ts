import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { feedbackPrompt } from '@/lib/prompts'
import type { FeedbackRequest, FeedbackResponse } from '@/types'

function parseFeedbackSections(feedback: string): FeedbackResponse['sections'] {
  // セクションを正規表現で抽出
  const pronunciationMatch = feedback.match(/##?\s*Pronunciation[\s\S]*?(?=##|\s*$)/i)
  const stressMatch = feedback.match(/##?\s*Stress[\s\S]*?(?=##|\s*$)/i)
  const expressionMatch = feedback.match(/##?\s*Expression[\s\S]*?(?=##|\s*$)/i)
  const practiceMatch = feedback.match(/##?\s*Practice[\s\S]*?(?=##|\s*$)/i)

  const pronunciation = pronunciationMatch?.[0] || ''
  const stress = stressMatch?.[0] || ''
  const expression = expressionMatch?.[0] || ''
  
  // 練習文を抽出（番号付きリストから）
  const practiceLines = practiceMatch?.[0]?.match(/\d+\.\s*"[^"]+"/g) || []
  const practice = practiceLines.map(line => line.replace(/^\d+\.\s*"/, '').replace(/"$/, ''))

  return {
    pronunciation,
    stress,
    expression,
    practice: practice.length > 0 ? practice : ['Practice sentence 1', 'Practice sentence 2', 'Practice sentence 3']
  }
}

export async function POST(request: Request) {
  try {
    const body: FeedbackRequest = await request.json()
    const { transcript, article, level } = body

    if (!transcript || transcript.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Transcript too short' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // gpt-5はまだ利用できないため、gpt-4oを使用
      temperature: 0.7,
      max_tokens: 600,
      messages: [
        { role: 'system', content: feedbackPrompt.system(level) },
        { role: 'user', content: feedbackPrompt.user(transcript, article) }
      ]
    })

    const feedback = completion.choices[0].message.content || ''
    const sections = parseFeedbackSections(feedback)

    const response: FeedbackResponse = {
      feedback,
      sections
    }

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate feedback' },
      { status: 500 }
    )
  }
}

