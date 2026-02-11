
"use client"

import Navbar from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Calendar, ChevronRight, History, Crown, Loader2 } from 'lucide-react'
import { MOCK_DOCTORS } from '@/app/lib/mock-data'
import Link from 'next/link'
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase'
import { collection, query, where, orderBy } from 'firebase/firestore'

export default function MySpecialistChatsPage() {
  const { user } = useUser()
  const firestore = useFirestore()

  const chatsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return query(
      collection(firestore, 'specialist_chat_sessions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
  }, [firestore, user])

  const { data: chats, isLoading } = useCollection(chatsQuery)

  const getDoctor = (id: string) => {
    return MOCK_DOCTORS.find(d => d.id === id)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Crown className="text-amber-500" /> Specialist Consultations
              </h1>
              <p className="text-muted-foreground">Your premium 1-on-1 chats with top specialists.</p>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/specialists">New Specialist Consultation</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : chats && chats.length > 0 ? (
              chats.map((chat) => {
                const doctor = getDoctor(chat.specialistId)
                const lastMessage = chat.messages?.[chat.messages.length - 1] || 'No messages yet'
                const [sender, ...textParts] = lastMessage.split(': ')
                const lastText = textParts.join(': ') || lastMessage

                return (
                  <Link key={chat.id} href={`/specialists/chat/${chat.id}`}>
                    <Card className="hover:border-primary/50 transition-all cursor-pointer group shadow-sm border-none bg-card hover:translate-x-1">
                      <CardContent className="p-6 flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0">
                          <img 
                            src={doctor?.avatar || `https://picsum.photos/seed/${chat.id}/200/200`} 
                            alt="Doctor" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg truncate">{doctor?.name || 'Specialist'}</h3>
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none rounded-full px-3 text-[10px] font-bold">
                              ACTIVE
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate italic">
                            {sender === 'System' ? lastText : `${sender}: ${lastText}`}
                          </p>
                          <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-1 uppercase font-bold tracking-wider">
                            <span className="flex items-center gap-1">
                              <MessageSquare size={12} />
                              {chat.messages?.length || 0} Messages
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Started: {new Date(chat.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                )
              })
            ) : (
              <div className="text-center py-20 bg-card/50 rounded-[2.5rem] border-2 border-dashed border-primary/10 space-y-6">
                <div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-primary">
                  <History size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">No specialist chats found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">Start a premium consultation to get expert medical advice directly from India's top specialists.</p>
                </div>
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/specialists">Browse Specialists</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
