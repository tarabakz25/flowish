import type { AppError } from '@/types'

export function createError(
  type: AppError['type'],
  message: string,
  retryable: boolean = false,
  details?: unknown
): AppError {
  return {
    type,
    message,
    retryable,
    details
  }
}

export function handleAPIError(error: unknown): AppError {
  if (error instanceof Error) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return createError('network', 'ネットワークエラーが発生しました。接続を確認してください。', true)
    }
    
    if (error.message.includes('timeout')) {
      return createError('api', 'リクエストがタイムアウトしました。もう一度お試しください。', true)
    }
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return createError('api', 'APIキーが無効です。設定を確認してください。', false)
    }
    
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return createError('api', 'リクエストが多すぎます。しばらく待ってから再試行してください。', true)
    }
  }
  
  return createError('api', 'エラーが発生しました。もう一度お試しください。', true, error)
}

export function handleMicrophoneError(error: unknown): AppError {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') {
      return createError(
        'permission',
        'マイクアクセスが必要です。ブラウザの設定でマイクを許可してください。',
        true
      )
    }
    
    if (error.name === 'NotFoundError') {
      return createError('permission', 'マイクが見つかりません。デバイスを確認してください。', false)
    }
    
    if (error.name === 'NotReadableError') {
      return createError('permission', 'マイクが使用中です。他のアプリケーションを閉じてください。', false)
    }
  }
  
  return createError('permission', 'マイクアクセスに失敗しました。', true, error)
}

