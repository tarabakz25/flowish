'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthButton } from './AuthButton'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'ホーム' },
    { href: '/dashboard', label: 'ダッシュボード' },
    { href: '/learn', label: '学習' },
  ]

  return (
    <header className="border-b border-surface1 bg-base/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-text hover:text-primary transition-colors">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-xl">Personal English Lab</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname?.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-surface1 text-text'
                        : 'text-subtext1 hover:text-text hover:bg-surface0'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <AuthButton />
        </div>
      </div>
    </header>
  )
}

