"use client"

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Bot, User, Sparkles, Loader2, Stethoscope, Utensils, Pill, MapPin, Map as MapIcon, Phone, Clock } from 'lucide-react'
import { healthAssistant } from '@/ai/flows/health-assistant'
import { cn } from '@/lib/utils'
import { Doctor } from '@/app/lib/mock-data'

interface ChatMessage {
  role: 'user' | 'model'
  text: string
  doctors?: Doctor[]
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Namaste! I'm HealthWise Pan-India AI. How can I help you today? I can find doctors across all of India—from Mumbai to Kolkata, sugerst Indian diet plans, or provide home care tips. Please let me know your city if you are looking for a doctor!" }
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
        history: messages.map(m => ({ role: m.role, text: m.text }))
      })
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text, 
        doctors: response.doctorsFound as Doctor[]
      }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { label: "Pediatrician in Chennai", icon: Stethoscope, prompt: "I am in Chennai, find me a pediatrician." },
    { label: "Orthopedic in Kolkata", icon: Stethoscope, prompt: "Find an orthopedic surgeon in Kolkata." },
    { label: "Cardiologist in Delhi", icon: Stethoscope, prompt: "I am in Delhi, find me a cardiologist." },
    { label: "Healthy Indian Diet", icon: Utensils, prompt: "Suggest a healthy Indian vegetarian diet plan." }
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 max-w-5xl py-6 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Chat Section */}
        <Card className="flex-[3] flex flex-col shadow-2xl border-none overflow-hidden rounded-3xl">
          <CardHeader className="bg-primary text-white flex flex-row items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-2xl">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">HealthWise Pan-India AI</CardTitle>
                <p className="text-xs text-white/70">Bharat's Comprehensive AI Care Partner • Pan-India</p>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          </CardHeader>

          <CardContent 
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/20" 
            ref={scrollRef}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-4">
                <div className={cn(
                  "flex gap-3 max-w-[90%]",
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

                {/* Map/Doctor View if doctors found */}
                {msg.doctors && msg.doctors.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="col-span-full bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                      <MapIcon className="text-primary h-5 w-5" />
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Top Rated Specialists Found</span>
                    </div>
                    {msg.doctors.map((doc) => (
                      <Card key={doc.id} className="overflow-hidden border-none shadow-md bg-white hover:shadow-lg transition-shadow">
                        <div className="h-24 bg-muted relative">
                          <img 
                            src={`https://picsum.photos/seed/${doc.id}/400/200`} 
                            alt="Map Placeholder" 
                            className="w-full h-full object-cover opacity-50 grayscale"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="text-primary h-8 w-8 animate-bounce" />
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <h4 className="font-bold text-sm">{doc.name}</h4>
                            <p className="text-[10px] text-accent font-bold uppercase">{doc.specialization}</p>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
                              <MapPin size={12} className="shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{doc.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <Phone size={12} className="shrink-0" />
                              <span>{doc.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <Clock size={12} className="shrink-0" />
                              <span>{doc.availability[0]}</span>
                            </div>
                          </div>
                          <Button size="sm" className="w-full h-8 text-xs rounded-full">
                            Navigate via Map
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
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
                placeholder="Ask me anything (Pan-India Coverage)..."
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

        {/* Info Sidebar */}
        <div className="hidden lg:flex flex-col w-64 gap-6">
          <Card className="border-none shadow-xl bg-accent text-white rounded-3xl p-6 space-y-4">
            <h3 className="font-bold">Pan-India Support</h3>
            <p className="text-xs opacity-90 leading-relaxed">
              Serving Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, and 100+ cities across Bharat.
            </p>
            <div className="pt-2">
              <div className="text-[10px] uppercase font-bold opacity-60 mb-2">Service Status</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs">Live Pan-India</span>
              </div>
            </div>
          </Card>
          
          <Card className="border-none shadow-xl rounded-3xl p-6">
            <h4 className="font-bold text-sm mb-4">India Safety Links</h4>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start text-[10px] h-8 rounded-full border-primary/10">
                <Phone size={12} className="mr-2 text-primary" /> Emergency: 102
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-[10px] h-8 rounded-full border-primary/10">
                <Pill size={12} className="mr-2 text-primary" /> Blood Bank
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
