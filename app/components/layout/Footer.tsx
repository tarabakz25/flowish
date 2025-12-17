import Link from 'next/link'
import { Github, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-surface1 bg-base mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-text font-semibold mb-4">Personal English Lab</h3>
            <p className="text-subtext1 text-sm">
              AIを活用した英語学習プラットフォーム
            </p>
          </div>

          <div>
            <h4 className="text-text font-semibold mb-4">リンク</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-subtext1 hover:text-text transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-subtext1 hover:text-text transition-colors">
                  ダッシュボード
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-subtext1 hover:text-text transition-colors">
                  学習を始める
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text font-semibold mb-4">お問い合わせ</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-subtext1 hover:text-text transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@example.com"
                className="text-subtext1 hover:text-text transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-surface1 text-center text-sm text-subtext1">
          <p>&copy; {new Date().getFullYear()} Personal English Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

