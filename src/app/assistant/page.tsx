"use client"

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Bot, User, Sparkles, Loader2, Stethoscope, Utensils, Pill } from 'lucide-react'
import { healthAssistant } from '@/ai/flows/health-assistant'
import { cn } from '@/lib/utils'

interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your HealthWise AI assistant. How can I help you today? I can help you find a doctor, suggest a diet plan, or provide home care tips." }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setIsLoading(true)

    try {
      const response = await healthAssistant({
        message: userMsg,
        history: messages
      })
      setMessages(prev => [...prev, { role: 'model', text: response.text }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { label: "Find a Cardiologist", icon: Stethoscope, prompt: "Can you find me a cardiologist nearby?" },
    { label: "Diet for Weight Loss", icon: Utensils, prompt: "Give me a simple diet chart for weight loss." },
    { label: "Home tips for Cold", icon: Pill, prompt: "What are some home remedies for a common cold?" }
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 max-w-4xl py-6 flex flex-col overflow-hidden">
        <Card className="flex-1 flex flex-col shadow-2xl border-none overflow-hidden rounded-3xl">
          <CardHeader className="bg-primary text-white flex flex-row items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-2xl">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">HealthWise AI</CardTitle>
                <p className="text-xs text-white/70">Always online • Your virtual care partner</p>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          </CardHeader>

          <CardContent 
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/20" 
            ref={scrollRef}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}>
                <Avatar className={cn(
                  "h-8 w-8 mt-1 shrink-0",
                  msg.role === 'user' ? "bg-accent" : "bg-primary"
                )}>
                  <AvatarFallback className="text-white">
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-accent text-white rounded-tr-none" 
                    : "bg-white text-foreground rounded-tl-none border shadow-sm prose prose-sm max-w-none"
                )}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={line.trim() === '' ? 'h-2' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 mr-auto items-center">
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback className="text-white"><Bot size={14} /></AvatarFallback>
                </Avatar>
                <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </CardContent>

          {/* Quick Actions */}
          <div className="px-6 py-3 border-t bg-white flex gap-2 overflow-x-auto no-scrollbar">
            {quickActions.map((action, i) => (
              <Button 
                key={i}
                variant="outline" 
                size="sm" 
                className="rounded-full shrink-0 h-9 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                onClick={() => {
                  setInput(action.prompt)
                }}
              >
                <action.icon size={14} />
                {action.label}
              </Button>
            ))}
          </div>

          <CardFooter className="p-4 bg-white border-t">
            <div className="flex w-full items-center gap-2 bg-muted/30 p-1.5 rounded-full border">
              <Input 
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 h-10 flex-1 px-4"
                placeholder="Ask me anything about your health..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                className="rounded-full h-10 w-10 p-0 shadow-lg"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
