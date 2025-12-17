'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'
import { useApp } from '@/app/context/AppContext'
import { FeedbackSkeleton } from './LoadingStates'

export function FeedbackDisplay() {
  const { currentSession, isGeneratingFeedback } = useApp()

  if (isGeneratingFeedback) {
    return <FeedbackSkeleton />
  }

  if (!currentSession?.feedback) {
    return null
  }

  return (
    <motion.div {...fadeIn}>
      <Card className="bg-surface0 border-surface1">
        <CardHeader>
          <CardTitle className="text-text">フィードバック</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="prose prose-invert max-w-none">
              <div className="text-text whitespace-pre-wrap">
                {currentSession.feedback}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

