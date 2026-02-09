"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Send, Plus, MoreHorizontal, Phone, Video, ChevronLeft, FileText, Pill } from 'lucide-react'
import { MOCK_CONSULTATIONS, MOCK_DOCTORS, Message } from '@/app/lib/mock-data'
import { cn } from '@/lib/utils'

export default function ChatPage() {
  const { id } = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const consultation = MOCK_CONSULTATIONS.find(c => c.id === id)
  const doctor = MOCK_DOCTORS.find(d => d.id === (consultation?.doctorId || 'doc1'))

  useEffect(() => {
    if (consultation) {
      setMessages(consultation.messages)
    }
  }, [consultation])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return
    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: 'user123',
      text: inputValue,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMessage])
    setInputValue('')

    // Mock doctor reply
    setTimeout(() => {
      const reply: Message = {
        id: Math.random().toString(),
        senderId: doctor?.id || 'doc1',
        text: "Thanks for the information. I'm reviewing your questionnaire data right now.",
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, reply])
    }, 1500)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col container mx-auto px-4 max-w-5xl py-4 overflow-hidden">
        <Card className="flex-1 flex flex-col shadow-2xl border-none overflow-hidden rounded-2xl">
          {/* Chat Header */}
          <CardHeader className="bg-primary text-white flex flex-row items-center justify-between p-4 space-y-0">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
                <ChevronLeft />
              </Button>
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarImage src={doctor?.avatar} />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold leading-none">{doctor?.name}</h3>
                <span className="text-xs text-white/70">Online • {doctor?.specialization}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                <Phone size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                <Video size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                <MoreHorizontal size={18} />
              </Button>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent 
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[#F5F7FF]" 
            ref={scrollRef}
          >
            <div className="text-center py-4">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                This consultation is secure and encrypted
              </span>
            </div>

            {messages.map((m) => {
              const isUser = m.senderId === 'user123'
              return (
                <div key={m.id} className={cn(
                  "flex max-w-[80%] flex-col",
                  isUser ? "ml-auto items-end" : "mr-auto items-start"
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm shadow-sm",
                    isUser 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-foreground rounded-tl-none border"
                  )}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })}
          </CardContent>

          {/* Actions Bar (Pre-filled buttons for simulated doctor functionality) */}
          <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t bg-white">
             <Button variant="outline" size="sm" className="rounded-full shrink-0 text-xs border-primary/20 hover:bg-primary/5">
                <FileText size={14} className="mr-1" /> View History
             </Button>
             <Button variant="outline" size="sm" className="rounded-full shrink-0 text-xs border-primary/20 hover:bg-primary/5">
                <Pill size={14} className="mr-1" /> Medication
             </Button>
          </div>

          {/* Input Area */}
          <CardFooter className="p-4 bg-white border-t">
            <div className="flex w-full items-center gap-2 bg-muted/30 p-1.5 rounded-full border shadow-inner">
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary h-10 w-10 shrink-0">
                <Plus size={20} />
              </Button>
              <Input 
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 h-10 flex-1 text-base"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                onClick={handleSend} 
                className="rounded-full h-10 w-10 p-0 bg-primary hover:bg-primary/90 shadow-md shrink-0 transition-all hover:scale-105"
                disabled={!inputValue.trim()}
              >
                <Send size={18} className="translate-x-0.5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}