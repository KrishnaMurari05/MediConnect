
"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Send, Plus, Phone, Video, ChevronLeft, MoreVertical, Crown, Info } from 'lucide-react'
import { MOCK_DOCTORS } from '@/app/lib/mock-data'
import { cn } from '@/lib/utils'

export default function ActiveSpecialistChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState([
    { id: '1', senderId: 'system', text: "Payment successful. You can now start your premium consultation with Dr. Aarti Lalchandani.", timestamp: new Date().toISOString() },
    { id: '2', senderId: 'doc', text: "Namaste! I have received your case request. Please tell me about your symptoms in detail.", timestamp: new Date().toISOString() }
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const doctor = MOCK_DOCTORS[0] // Mocking the first doctor as the active one

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg = {
      id: Math.random().toString(),
      senderId: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMsg])
    setInput('')

    // Mock doctor reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        senderId: 'doc',
        text: "I understand. Have you had any similar issues in the past? Also, please share if you are currently on any medication.",
        timestamp: new Date().toISOString()
      }])
    }, 1500)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 max-w-4xl py-4 flex flex-col overflow-hidden">
        <Card className="flex-1 flex flex-col border-none shadow-2xl rounded-3xl overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-primary text-white p-4 space-y-0 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push('/specialists')} className="text-white hover:bg-white/10 rounded-full">
                <ChevronLeft />
              </Button>
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src={doctor.avatar} />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 bg-amber-400 text-primary rounded-full p-0.5">
                  <Crown size={10} />
                </div>
              </div>
              <div>
                <h3 className="font-bold leading-none">{doctor.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  <span className="text-[10px] text-white/70">Specialist • Online</span>
                </div>
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
                 <MoreVertical size={18} />
               </Button>
            </div>
          </CardHeader>

          {/* Info Banner */}
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-center gap-2 text-[10px] text-amber-700 font-bold uppercase tracking-wider">
            <Info size={12} /> Specialist chat remains active for 48 hours
          </div>

          {/* Chat Area */}
          <CardContent 
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/20" 
            ref={scrollRef}
          >
            {messages.map((m) => {
              const isUser = m.senderId === 'user'
              const isSystem = m.senderId === 'system'

              if (isSystem) {
                return (
                  <div key={m.id} className="text-center">
                    <span className="text-[10px] font-bold bg-muted text-muted-foreground px-3 py-1 rounded-full uppercase tracking-widest">
                      {m.text}
                    </span>
                  </div>
                )
              }

              return (
                <div key={m.id} className={cn(
                  "flex flex-col max-w-[80%]",
                  isUser ? "ml-auto items-end" : "mr-auto items-start"
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
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

          {/* Footer Input */}
          <CardFooter className="p-4 bg-white border-t">
            <div className="flex w-full items-center gap-2 bg-muted/30 p-1.5 rounded-full border">
               <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary h-10 w-10">
                 <Plus size={20} />
               </Button>
               <Input 
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10 flex-1 px-4"
                placeholder="Discuss your matter with the specialist..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               />
               <Button 
                onClick={handleSend} 
                className="rounded-full h-10 w-10 p-0 shadow-lg"
                disabled={!input.trim()}
               >
                 <Send size={18} />
               </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
