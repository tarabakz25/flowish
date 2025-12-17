'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { History, Trash2 } from 'lucide-react'
import { useApp } from '@/app/context/AppContext'
import { loadSessions, deleteSession, clearAllSessions } from '@/utils/storage'
import { motion } from 'framer-motion'
import { slideFromRight } from '@/lib/animations'
import { toast } from 'sonner'
import type { Session } from '@/types'

export function SessionHistory() {
  const { currentSession, loadSession } = useApp()
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)

  // セッションリストを更新する関数
  const refreshSessions = useCallback(() => {
    const loaded = loadSessions()
    setSessions(loaded)
  }, [])

  // セッションが更新されたらリストを再読み込み（イベントハンドラ経由で呼び出す）
  // useEffect内でのsetState呼び出しを避けるため、currentSessionの変更を監視して
  // 必要に応じてrefreshSessionsを呼び出す
  const prevSessionIdRef = useRef<string | undefined>(currentSession?.id)
  
  useEffect(() => {
    if (currentSession?.id !== prevSessionIdRef.current) {
      prevSessionIdRef.current = currentSession?.id
      // 次のレンダリングサイクルで更新
      setTimeout(() => {
        refreshSessions()
      }, 0)
    }
  }, [currentSession?.id, refreshSessions])

  const handleLoadSession = (sessionId: string) => {
    loadSession(sessionId)
    refreshSessions()
    toast.success('Session loaded', {
      description: 'セッションを読み込みました'
    })
  }

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete)
      refreshSessions()
      setDeleteDialogOpen(false)
      setSessionToDelete(null)
      toast.success('Session deleted', {
        description: 'セッションを削除しました'
      })
    }
  }

  const handleClearAll = () => {
    clearAllSessions()
    setSessions([])
    setClearDialogOpen(false)
    toast.success('History cleared', {
      description: '全セッション履歴を削除しました'
    })
  }

  const formatTime = (timestamp: number) => {
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

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="border-surface1 text-text">
            <History className="mr-2 h-4 w-4" />
            Past Sessions
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-base border-surface1 w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="text-text">Session History</SheetTitle>
          </SheetHeader>
          
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-subtext1">
              <History className="h-12 w-12 mb-4 opacity-50" />
              <p>No past sessions yet</p>
              <p className="text-sm mt-2">Your learning sessions will appear here</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[calc(100vh-200px)] mt-4">
                <div className="space-y-3 pr-4">
                  {sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      {...slideFromRight}
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        currentSession?.id === session.id
                          ? 'bg-surface1 border-mauve'
                          : 'bg-surface0 border-surface1 hover:bg-surface1'
                      }`}
                      onClick={() => handleLoadSession(session.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text line-clamp-1">
                            {session.title || session.topic}
                          </p>
                          <p className="text-xs text-subtext0 mt-1">
                            {formatTime(session.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge variant="secondary" className="bg-mauve/20 text-mauve">
                            {session.level}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red hover:text-red/80 hover:bg-red/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClick(session.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3 flex-wrap">
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
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="mt-4 pt-4 border-t border-surface1">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setClearDialogOpen(true)}
                >
                  Clear All History
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-surface0 border-surface1">
          <DialogHeader>
            <DialogTitle className="text-text">Delete Session</DialogTitle>
            <DialogDescription className="text-subtext1">
              このセッションを削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setSessionToDelete(null)
              }}
              className="border-surface1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red hover:bg-red/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="bg-surface0 border-surface1">
          <DialogHeader>
            <DialogTitle className="text-text">Clear All History</DialogTitle>
            <DialogDescription className="text-subtext1">
              全セッション履歴を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClearDialogOpen(false)}
              className="border-surface1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              className="bg-red hover:bg-red/90"
            >
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

