
"use client"

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Send, Plus, Phone, Video, ChevronLeft, MoreVertical, Crown, Info, Loader2 } from 'lucide-react'
import { MOCK_DOCTORS } from '@/app/lib/mock-data'
import { cn } from '@/lib/utils'
import { useDoc, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase'
import { doc, arrayUnion, DocumentReference } from 'firebase/firestore'

export default function SpecialistChatSessionPage() {
  const { sessionId } = useParams()
  const router = useRouter()
  const { user } = useUser()
  const firestore = useFirestore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const sessionRef = useMemoFirebase(() => {
    if (!firestore || !sessionId) return null
    return doc(firestore, 'specialist_chat_sessions', sessionId as string)
  }, [firestore, sessionId])

  const { data: session, isLoading } = useDoc(sessionRef as DocumentReference)

  const doctor = MOCK_DOCTORS.find(d => d.id === session?.specialistId) || MOCK_DOCTORS[0]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [session?.messages])

  const handleSend = () => {
    if (!input.trim() || !sessionRef || !user) return
    
    const messageText = `${user.displayName || 'Patient'}: ${input.trim()}`
    
    updateDocumentNonBlocking(sessionRef as DocumentReference, {
      messages: arrayUnion(messageText)
    })
    
    setInput('')
  }

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <p className="text-muted-foreground">Session not found or expired.</p>
          <Button onClick={() => router.push('/specialists')}>Back to Specialists</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 max-w-4xl py-4 flex flex-col overflow-hidden">
        <Card className="flex-1 flex flex-col border-none shadow-2xl rounded-3xl overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-primary text-white p-4 space-y-0 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push('/specialists/my-chats')} className="text-white hover:bg-white/10 rounded-full">
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
            <Info size={12} /> Specialist chat for: {session.topic}
          </div>

          {/* Chat Area */}
          <CardContent 
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/20" 
            ref={scrollRef}
          >
            {session.messages?.map((msg: string, idx: number) => {
              const [sender, ...textParts] = msg.split(': ')
              const text = textParts.join(': ')
              const isUser = sender !== 'Doctor' && sender !== 'System'

              return (
                <div key={idx} className={cn(
                  "flex flex-col max-w-[80%]",
                  isUser ? "ml-auto items-end" : "mr-auto items-start"
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isUser 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-foreground rounded-tl-none border"
                  )}>
                    <div className="text-[10px] opacity-60 font-bold mb-1 uppercase">{sender}</div>
                    {text}
                  </div>
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
