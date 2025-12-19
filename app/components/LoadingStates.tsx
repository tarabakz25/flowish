import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ArticleSkeleton() {
  return (
    <Card className="bg-surface0 border-surface1">
      <CardHeader>
        <Skeleton className="h-6 w-32 bg-surface1" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full bg-surface1" />
        <Skeleton className="h-4 w-full bg-surface1" />
        <Skeleton className="h-4 w-3/4 bg-surface1" />
        <Skeleton className="h-4 w-full bg-surface1" />
        <Skeleton className="h-4 w-5/6 bg-surface1" />
        <div className="pt-4" />
        <Skeleton className="h-4 w-full bg-surface1" />
        <Skeleton className="h-4 w-full bg-surface1" />
        <Skeleton className="h-4 w-2/3 bg-surface1" />
        <Skeleton className="h-4 w-full bg-surface1" />
        <Skeleton className="h-4 w-4/5 bg-surface1" />
      </CardContent>
    </Card>
  )
}

export function FeedbackSkeleton() {
  return (
    <Card className="bg-surface0 border-surface1">
      <CardHeader>
        <Skeleton className="h-6 w-32 bg-surface1" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 bg-surface1" />
          <Skeleton className="h-4 w-full bg-surface1" />
          <Skeleton className="h-4 w-full bg-surface1" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 bg-surface1" />
          <Skeleton className="h-4 w-full bg-surface1" />
          <Skeleton className="h-4 w-3/4 bg-surface1" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 bg-surface1" />
          <Skeleton className="h-4 w-full bg-surface1" />
          <Skeleton className="h-4 w-full bg-surface1" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 bg-surface1" />
          <Skeleton className="h-4 w-full bg-surface1" />
          <Skeleton className="h-4 w-3/4 bg-surface1" />
        </div>
      </CardContent>
    </Card>
  )
}



