'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, X, RefreshCw } from 'lucide-react'
import { useApp } from '@/app/context/AppContext'

export function ErrorDisplay() {
  const { error, clearError } = useApp()

  if (!error) {
    return null
  }

  return (
    <Alert className="bg-red/10 border-red text-red mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>エラー</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error.message}</p>
        {error.retryable && (
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearError}
              className="border-red text-red hover:bg-red/10"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              リトライ
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="h-6 w-6 p-0 text-red hover:text-red/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {!error.retryable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="h-6 w-6 p-0 text-red hover:text-red/80 mt-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

