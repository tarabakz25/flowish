'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { slideIn } from '@/lib/animations'
import { Send } from 'lucide-react'
import { useApp } from '@/app/context/AppContext'
import { validateMessage } from '@/utils/validation'
import { toast } from 'sonner'
import type { Message } from '@/types'

export function ChatSection() {
  const { currentSession, isSendingMessage, setIsSendingMessage, addChatMessage } = useApp()
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const article = currentSession?.article || ''
  const messages = currentSession?.chatMessages || []

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  const handleSend = async () => {
    const validation = validateMessage(input)
    if (!validation.valid || !article) {
      return
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    }

    addChatMessage(userMessage)
    setInput('')
    setTyping(true)
    setIsSendingMessage(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          article,
          history: messages
        })
      })

      const data = await response.json()

      if (data.success && data.data) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.data.message,
          timestamp: data.data.timestamp
        }
        addChatMessage(assistantMessage)
      } else {
        toast.error('Failed to send message', {
          description: data.error || 'Please try again'
        })
      }
    } catch (err) {
      console.error('Chat error:', err)
      toast.error('Network error', {
        description: 'Failed to send message. Please check your connection.'
      })
    } finally {
      setTyping(false)
      setIsSendingMessage(false)
    }
  }

  if (!article) {
    return (
      <Card className="bg-surface0 border-surface1 h-[600px] flex items-center justify-center">
        <CardContent>
          <p className="text-subtext1 text-center">
            まず記事を生成してください
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-surface0 border-surface1 h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-text">AI ディスカッション</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 py-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  {...slideIn}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-mauve text-crust'
                        : 'bg-surface1 text-text'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-surface1 text-text rounded-lg p-3">
                  AI is typing...
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-surface1 flex gap-2">
          <Textarea
            placeholder="Type your message in English..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="bg-surface1 border-overlay0 text-text resize-none"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSendingMessage}
            size="icon"
            className="bg-blue hover:bg-blue/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

