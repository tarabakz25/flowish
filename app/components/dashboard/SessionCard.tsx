'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, ExternalLink } from 'lucide-react'
import type { Session } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface SessionCardProps {
  session: Session
  onDelete: (sessionId: string) => void
  isDeleting?: boolean
}

export function SessionCard({ session, onDelete, isDeleting }: SessionCardProps) {
  const formatTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      if (diffDays > 0) {
        return `${diffDays}日前`
      } else if (diffHours > 0) {
        return `${diffHours}時間前`
      } else {
        const diffMins = Math.floor(diffMs / (1000 * 60))
        return diffMins > 0 ? `${diffMins}分前` : 'たった今'
      }
    }
  }

  return (
    <Card className="bg-surface0 border-surface1 hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-text line-clamp-2">
              {session.title || session.topic}
            </CardTitle>
            <CardDescription className="text-subtext1 mt-1">
              {formatTime(session.timestamp)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="secondary" className="bg-mauve/20 text-mauve">
              {session.level}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red hover:text-red/80 hover:bg-red/10"
              onClick={() => onDelete(session.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4 flex-wrap">
          {session.article && (
            <Badge variant="outline" className="text-xs border-overlay0 text-subtext1">
              {session.article.split(/\s+/).length} words
            </Badge>
          )}
          {session.chatMessages.length > 0 && (
            <Badge variant="outline" className="text-xs border-overlay0 text-subtext1">
              💬 {session.chatMessages.length}
            </Badge>
          )}
          {session.feedback && (
            <Badge className="text-xs bg-green/20 text-green border-0">
              ✓ Feedback
            </Badge>
          )}
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Link href={`/learn?session=${session.id}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            続きを読む
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

