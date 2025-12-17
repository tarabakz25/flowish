import { loadSessions } from './storage'

const MIGRATION_FLAG_KEY = 'personal-english-lab-migrated-to-supabase'

export function hasMigrated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(MIGRATION_FLAG_KEY) === 'true'
}

export function setMigrated(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(MIGRATION_FLAG_KEY, 'true')
}

export async function migrateLocalStorageToSupabase(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (hasMigrated()) return false

  try {
    const sessions = loadSessions()
    if (sessions.length === 0) {
      setMigrated()
      return true
    }

    // 各セッションをSupabaseにアップロード
    for (const session of sessions) {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      })

      const result = await response.json()
      if (!result.success) {
        console.error(`Failed to migrate session ${session.id}:`, result.error)
        return false
      }
    }

    setMigrated()
    return true
  } catch (error) {
    console.error('Migration failed:', error)
    return false
  }
}

