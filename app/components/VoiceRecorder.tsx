'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { pulse } from '@/lib/animations'
import { Mic, Square } from 'lucide-react'
import { useApp } from '@/app/context/AppContext'
import { handleMicrophoneError } from '@/utils/errors'
import { toast } from 'sonner'

export function VoiceRecorder() {
  const { isRecording, setIsRecording, setIsTranscribing, updateTranscript, setError } = useApp()
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      })

      streamRef.current = stream
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      const chunks: Blob[] = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        await uploadAudio(audioBlob)
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      const appError = handleMicrophoneError(error)
      setError(appError)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const uploadAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'recording.webm')

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success && data.data) {
        updateTranscript(data.data.transcript)
        toast.success('Speech transcribed', {
          description: '音声をテキストに変換しました'
        })
      } else {
        const errorMsg = data.error || '音声認識に失敗しました'
        setError({
          type: 'api',
          message: errorMsg,
          retryable: true
        })
        toast.error('Transcription failed', {
          description: errorMsg
        })
      }
    } catch {
      const errorMsg = 'ネットワークエラーが発生しました'
      setError({
        type: 'network',
        message: errorMsg,
        retryable: true
      })
      toast.error('Network error', {
        description: errorMsg
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <Card className="bg-surface0 border-surface1">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={isRecording ? pulse : {}}
          >
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              size="lg"
              className={`rounded-full w-20 h-20 ${
                isRecording
                  ? 'bg-red hover:bg-red/90'
                  : 'bg-green hover:bg-green/90'
              }`}
            >
              {isRecording ? (
                <Square className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </motion.div>

          <div className="text-center">
            <p className="text-sm font-medium text-text">
              {isRecording ? '録音中...' : 'Ready to record'}
            </p>
            {isRecording && (
              <p className="text-2xl font-mono text-mauve mt-2">
                {formatTime(recordingTime)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

