'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function QuickStart() {
  return (
    <Card className="bg-gradient-to-br from-mauve/20 to-blue/20 border-mauve">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-mauve" />
          <CardTitle className="text-text">新しい学習を始める</CardTitle>
        </div>
        <CardDescription className="text-subtext1">
          トピックを選んで、AIが生成する記事で学習を始めましょう
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="lg" className="w-full">
          <Link href="/learn">
            学習を開始
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

