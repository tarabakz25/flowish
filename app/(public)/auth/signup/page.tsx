'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error('パスワードが一致しません')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('アカウントを作成しました')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('アカウント作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    try {
      setOauthLoading(provider)
      const supabase = createClient()

      const redirectTo = `${window.location.origin}/api/auth/callback?next=/dashboard`
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch {
      toast.error('外部プロバイダでのサインアップに失敗しました')
    } finally {
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Personal English Lab</h1>
          <p className="text-subtext1 mt-2">新規アカウントを作成</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
              メールアドレス
            </label>
            <Input
              className="text-[var(--color-card-foreground)]"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
              パスワード
            </label>
            <Input
              className="text-[var(--color-card-foreground)]"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
            <p className="text-xs text-subtext1 mt-1">6文字以上で入力してください</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
              パスワード（確認）
            </label>
            <Input
              className="text-[var(--color-card-foreground)]"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '作成中...' : 'アカウント作成'}
          </Button>
        </form>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading || oauthLoading !== null}
            onClick={() => handleOAuthSignup('google')}
          >
            {oauthLoading === 'google' ? 'Googleで登録中...' : 'Googleで登録'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading || oauthLoading !== null}
            onClick={() => handleOAuthSignup('github')}
          >
            {oauthLoading === 'github' ? 'GitHubで登録中...' : 'GitHubで登録'}
          </Button>
        </div>

        <div className="text-center text-sm text-subtext1">
          <span>既にアカウントをお持ちの方は</span>{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}

