'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('ログインに成功しました')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
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
      toast.error('外部プロバイダでのログインに失敗しました')
    } finally {
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Personal English Lab</h1>
          <p className="text-subtext1 mt-2">ログインして学習を続けましょう</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
              メールアドレス
            </label>
            <Input
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
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading || oauthLoading !== null}
            onClick={() => handleOAuthLogin('google')}
          >
            {oauthLoading === 'google' ? 'Googleでログイン中...' : 'Googleでログイン'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading || oauthLoading !== null}
            onClick={() => handleOAuthLogin('github')}
          >
            {oauthLoading === 'github' ? 'GitHubでログイン中...' : 'GitHubでログイン'}
          </Button>
        </div>

        <div className="text-center text-sm text-subtext1">
          <span>アカウントをお持ちでない方は</span>{' '}
          <Link href="/auth/signup" className="text-primary hover:underline">
            新規登録
          </Link>
        </div>
      </div>
    </div>
  )
}

