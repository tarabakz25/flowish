'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VoiceRecorder } from './VoiceRecorder'
import { useApp } from '@/app/context/AppContext'
import { validateTranscript } from '@/utils/validation'
import { toast } from 'sonner'

export function SpeakingSection() {
  const { currentSession, isGeneratingFeedback, setIsGeneratingFeedback, updateFeedback, updateTranscript } = useApp()
  const [transcript, setTranscript] = useState(currentSession?.transcript || '')

  useEffect(() => {
    if (currentSession?.transcript) {
      setTranscript(currentSession.transcript)
    }
  }, [currentSession?.transcript])

  const handleGenerateFeedback = async () => {
    const validation = validateTranscript(transcript)
    if (!validation.valid || !currentSession?.article) {
      return
    }

    setIsGeneratingFeedback(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          article: currentSession.article,
          level: currentSession.level
        })
      })

      const data = await response.json()

      if (data.success && data.data) {
        updateFeedback(data.data.feedback)
        toast.success('Feedback generated', {
          description: 'スピーキングフィードバックを生成しました'
        })
      } else {
        toast.error('Failed to generate feedback', {
          description: data.error || 'Please try again'
        })
      }
    } catch (err) {
      console.error('Feedback error:', err)
      toast.error('Network error', {
        description: 'Failed to generate feedback. Please check your connection.'
      })
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-surface0 border-surface1">
        <CardHeader>
          <CardTitle className="text-text">スピーキング練習</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VoiceRecorder />
          
          {currentSession?.transcript && (
            <div>
              <label className="text-sm font-medium text-subtext1 mb-2 block">
                トランスクリプト
              </label>
              <Textarea
                value={transcript}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setTranscript(e.target.value)
                  updateTranscript(e.target.value)
                }}
                placeholder="Your speech will appear here..."
                className="bg-surface1 border-overlay0 text-text min-h-[100px]"
              />
              <Button
                onClick={handleGenerateFeedback}
                disabled={!transcript.trim() || transcript.length < 10 || isGeneratingFeedback}
                className="mt-4 w-full bg-mauve hover:bg-mauve/90 text-crust"
              >
                {isGeneratingFeedback ? '生成中...' : 'フィードバックを生成'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

