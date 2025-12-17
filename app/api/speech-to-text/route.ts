import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import type { STTResponse } from '@/types'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No audio file' },
        { status: 400 }
      )
    }

    // ファイルサイズチェック（25MB制限）
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large' },
        { status: 400 }
      )
    }

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json'
    })

    const response: STTResponse = {
      transcript: transcription.text,
      duration: 0 // Whisper doesn't return duration
    }

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('STT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}

