export function validateTopic(topic: string): { valid: boolean; error?: string } {
  if (!topic || topic.trim().length === 0) {
    return { valid: false, error: 'トピックを入力してください' }
  }
  
  if (topic.length < 2) {
    return { valid: false, error: '2文字以上入力してください' }
  }
  
  if (topic.length > 200) {
    return { valid: false, error: '200文字以内にしてください' }
  }
  
  return { valid: true }
}

export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'メッセージを入力してください' }
  }
  
  if (message.length > 500) {
    return { valid: false, error: '500文字以内にしてください' }
  }
  
  return { valid: true }
}

export function validateTranscript(transcript: string): { valid: boolean; error?: string } {
  if (!transcript || transcript.trim().length < 10) {
    return { valid: false, error: 'トランスクリプトは10文字以上必要です' }
  }
  
  return { valid: true }
}

