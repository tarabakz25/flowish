'use client'

import { useEffect, useState } from 'react'
import { SessionCard } from '@/app/components/dashboard/SessionCard'
import { StatsPanel } from '@/app/components/dashboard/StatsPanel'
import { QuickStart } from '@/app/components/dashboard/QuickStart'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Session } from '@/types'
import { migrateLocalStorageToSupabase, hasMigrated } from '@/utils/migrate-to-supabase'

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // 初回ログイン時にlocalStorageからSupabaseへ移行
    const performMigration = async () => {
      if (!hasMigrated()) {
        const success = await migrateLocalStorageToSupabase()
        if (success) {
          toast.success('データを移行しました')
        }
      }
    }
    
    performMigration().then(() => {
      loadSessions()
    })
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sessions')
      const result = await response.json()

      if (result.success) {
        setSessions(result.data || [])
      } else {
        toast.error('セッションの読み込みに失敗しました')
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
      toast.error('セッションの読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/sessions?id=${sessionToDelete}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('セッションを削除しました')
        setSessions(sessions.filter(s => s.id !== sessionToDelete))
        setDeleteDialogOpen(false)
        setSessionToDelete(null)
      } else {
        toast.error('セッションの削除に失敗しました')
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
      toast.error('セッションの削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">ダッシュボード</h1>
          <p className="text-subtext1">学習の進捗とセッション履歴を確認できます</p>
        </div>

        <StatsPanel sessions={sessions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-text">セッション履歴</h2>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-12 bg-surface0 rounded-lg border border-surface1">
                <p className="text-subtext1 mb-4">まだセッションがありません</p>
                <Button asChild>
                  <a href="/learn">学習を始める</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onDelete={handleDeleteClick}
                    isDeleting={isDeleting && sessionToDelete === session.id}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <QuickStart />
          </div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-surface0 border-surface1">
          <DialogHeader>
            <DialogTitle className="text-text">セッションを削除</DialogTitle>
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
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red hover:bg-red/90"
              disabled={isDeleting}
            >
              {isDeleting ? '削除中...' : '削除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

