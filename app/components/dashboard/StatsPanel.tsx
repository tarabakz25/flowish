'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, MessageSquare, Mic } from 'lucide-react'
import type { Session } from '@/types'

interface StatsPanelProps {
  sessions: Session[]
}

export function StatsPanel({ sessions }: StatsPanelProps) {
  const totalSessions = sessions.length
  const totalArticles = sessions.filter(s => s.article).length
  const totalChatMessages = sessions.reduce((sum, s) => sum + s.chatMessages.length, 0)
  const totalFeedback = sessions.filter(s => s.feedback).length

  const stats = [
    {
      label: '総セッション数',
      value: totalSessions,
      icon: BookOpen,
      color: 'text-blue',
    },
    {
      label: '記事生成数',
      value: totalArticles,
      icon: BookOpen,
      color: 'text-mauve',
    },
    {
      label: '対話メッセージ数',
      value: totalChatMessages,
      icon: MessageSquare,
      color: 'text-green',
    },
    {
      label: 'フィードバック数',
      value: totalFeedback,
      icon: Mic,
      color: 'text-peach',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-surface0 border-surface1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-subtext1">
              {stat.label}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

