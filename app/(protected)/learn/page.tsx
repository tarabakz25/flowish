import { AppProvider } from '../../context/AppContext'
import { TopicInput } from '../../components/TopicInput'
import { ArticleDisplay } from '../../components/ArticleDisplay'
import { ChatSection } from '../../components/ChatSection'
import { SpeakingSection } from '../../components/SpeakingSection'
import { FeedbackDisplay } from '../../components/FeedbackDisplay'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import { SessionHistory } from '../../components/SessionHistory'
import { Separator } from '@/components/ui/separator'

export default function LearnPage() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-base p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-text">Personal English Lab</h1>
              <p className="text-subtext1">AI-powered English learning platform</p>
            </div>
            <SessionHistory />
          </header>

          <ErrorDisplay />

          <TopicInput />

          <Separator className="bg-surface1" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ArticleDisplay />
            <ChatSection />
          </div>

          <Separator className="bg-surface1" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpeakingSection />
            <FeedbackDisplay />
          </div>
        </div>
      </div>
    </AppProvider>
  )
}

