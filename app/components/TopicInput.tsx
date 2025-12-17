'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'
import { useApp } from '@/app/context/AppContext'
import { validateTopic } from '@/utils/validation'
import { toast } from 'sonner'
import type { CEFRLevel } from '@/types'

export function TopicInput() {
  const { createNewSession, setIsGeneratingArticle, updateArticle, setError, isGeneratingArticle } = useApp()
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState<CEFRLevel>('B2')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleGenerate = async () => {
    const validation = validateTopic(topic)
    if (!validation.valid) {
      setLocalError(validation.error || '')
      return
    }

    setLocalError(null)
    createNewSession(topic, level)
    setIsGeneratingArticle(true)

    try {
      const response = await fetch('/api/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level })
      })

      const data = await response.json()

      if (data.success && data.data) {
        updateArticle(data.data.article)
        toast.success('Article generated', {
          description: `${data.data.wordCount} words • ~${data.data.estimatedReadTime} min read`
        })
      } else {
        setError({
          type: 'api',
          message: data.error || '記事の生成に失敗しました',
          retryable: true
        })
      }
    } catch (err) {
      setError({
        type: 'network',
        message: 'ネットワークエラーが発生しました',
        retryable: true
      })
    } finally {
      setIsGeneratingArticle(false)
    }
  }

  return (
    <motion.div {...fadeIn}>
      <Card className="bg-surface0 border-surface1">
        <CardHeader>
          <CardTitle className="text-text">トピック入力</CardTitle>
          <CardDescription className="text-subtext1">
            興味のあるトピックを入力して、英文記事を生成します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-subtext1 mb-2 block">
              トピック
            </label>
            <Input
              placeholder="例: startup culture, AI ethics, anime storytelling"
              value={topic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTopic(e.target.value)
                setLocalError(null)
              }}
              className="bg-surface1 border-overlay0 text-text placeholder:text-overlay1"
            />
            {localError && (
              <p className="text-sm text-red mt-1">{localError}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-subtext1 mb-2 block">
              レベル選択
            </label>
            <Select value={level} onValueChange={(value: string) => setLevel(value as CEFRLevel)}>
              <SelectTrigger className="bg-surface1 border-overlay0 text-text">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A2">A2 - Elementary</SelectItem>
                <SelectItem value="B1">B1 - Intermediate</SelectItem>
                <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                <SelectItem value="C1">C1 - Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!topic.trim() || topic.length < 2 || isGeneratingArticle}
            className="w-full bg-mauve hover:bg-mauve/90 text-crust"
            size="lg"
          >
            {isGeneratingArticle ? '生成中...' : '記事を生成'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

