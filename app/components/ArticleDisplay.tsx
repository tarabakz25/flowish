'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'
import { useApp } from '@/app/context/AppContext'
import { ArticleSkeleton } from './LoadingStates'

export function ArticleDisplay() {
  const { currentSession, isGeneratingArticle } = useApp()

  if (isGeneratingArticle) {
    return <ArticleSkeleton />
  }

  if (!currentSession?.article) {
    return null
  }

  return (
    <motion.div {...fadeIn}>
      <Card className="bg-surface0 border-surface1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-text">記事</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-mauve/20 text-mauve">
                {currentSession.level}
              </Badge>
              <Badge variant="outline" className="border-overlay0 text-subtext1">
                {currentSession.article.split(/\s+/).length} words
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-text leading-relaxed whitespace-pre-wrap">
                {currentSession.article}
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

