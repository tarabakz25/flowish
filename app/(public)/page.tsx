'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BookOpen, MessageSquare, Mic, TrendingUp, Sparkles, Target } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-base to-mantle py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface1 text-subtext1 text-sm mb-8"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AIを活用した次世代の英語学習</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-6">
              Personal English Lab
            </h1>
            <p className="text-xl sm:text-2xl text-subtext1 mb-8 max-w-2xl mx-auto">
              AIがあなたのレベルに合わせた記事を生成し、
              <br />
              対話とスピーキングで実践的な英語力を身につけます
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Link href="/auth/signup">
                  無料で始める
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Link href="/auth/login">
                  ログイン
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text mb-4">
              あなたの英語学習をサポート
            </h2>
            <p className="text-xl text-subtext1 max-w-2xl mx-auto">
              最新のAI技術を活用した、パーソナライズされた学習体験
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'レベル別記事生成',
                description: 'CEFRレベル（A2〜C1）に合わせた記事をAIが自動生成。あなたのレベルに最適化された学習コンテンツを提供します。',
              },
              {
                icon: MessageSquare,
                title: 'AI対話練習',
                description: '生成された記事についてAIと対話することで、理解を深め、質問力と表現力を向上させます。',
              },
              {
                icon: Mic,
                title: 'スピーキング練習',
                description: '音声録音機能で発音を練習し、AIが詳細なフィードバックを提供。発音、アクセント、表現を改善できます。',
              },
              {
                icon: Target,
                title: 'パーソナライズ',
                description: 'あなたの学習履歴を記録し、進捗を可視化。継続的な学習をサポートします。',
              },
              {
                icon: TrendingUp,
                title: '進捗トラッキング',
                description: 'ダッシュボードで学習セッションを管理し、あなたの成長を確認できます。',
              },
              {
                icon: Sparkles,
                title: 'AIフィードバック',
                description: '発音、アクセント、表現について詳細なフィードバックを受け取り、効率的に改善できます。',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-lg bg-surface0 border border-surface1 hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/20 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-text">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-subtext1">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-mantle to-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-text mb-6">
              今すぐ始めましょう
            </h2>
            <p className="text-xl text-subtext1 mb-8">
              無料でアカウントを作成し、AIを活用した英語学習を体験してください
            </p>
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link href="/auth/signup">
                無料で始める
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

