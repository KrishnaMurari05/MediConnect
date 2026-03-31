"use client"

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Bot, User, Sparkles, Loader2, Stethoscope, Utensils, Pill, MapPin, Map as MapIcon, Phone, Clock, ArrowUpCircle } from 'lucide-react'
import { healthAssistant } from '@/ai/flows/health-assistant'
import { cn } from '@/lib/utils'
import { Doctor } from '@/app/lib/mock-data'
import { Badge } from '@/components/ui/badge'

interface ChatMessage {
  role: 'user' | 'model'
  text: string
  doctors?: Doctor[]
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Namaste! I'm your MediConnect AI Companion. How can I help you today? I can find top specialists across Bharat, suggest localized Indian diet plans, and provide instant home care tips. Where are you located?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async (customInput?: string) => {
    const userMsg = customInput || input.trim()
    if (!userMsg || isLoading) return

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
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an issue while processing your request. Please try again in a moment." }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { label: "Cardiologist in Kanpur", icon: Stethoscope, prompt: "I am in Kanpur, find me a cardiologist." },
    { label: "Neurologist in Kanpur", icon: Stethoscope, prompt: "Find a neurologist in Kanpur." },
    { label: "Indian Diet Plan", icon: Utensils, prompt: "Suggest a healthy Indian vegetarian diet plan for high protein." },
    { label: "Home Remedies", icon: Pill, prompt: "Home remedies for mild seasonal cough." }
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 max-w-6xl py-6 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Chat Section */}
        <Card className="flex-[3] flex flex-col shadow-3xl border-none overflow-hidden rounded-[2.5rem] bg-white relative">
          <CardHeader className="bg-primary text-white flex flex-row items-center justify-between p-8 space-y-0">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-inner">
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">MediConnect AI</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">Bharat's Health Expert • Online</span>
                </div>
              </div>
            </div>
            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
          </CardHeader>

          <CardContent 
            className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/5 no-scrollbar" 
            ref={scrollRef}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}>
                  <Avatar className={cn(
                    "h-10 w-10 shrink-0 shadow-lg border-2",
                    msg.role === 'user' ? "bg-accent border-accent/20" : "bg-primary border-primary/20"
                  )}>
                    <AvatarFallback className="text-white">
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "px-6 py-4 rounded-[2rem] text-base leading-relaxed font-medium shadow-sm transition-all interactive-card",
                    msg.role === 'user' 
                      ? "bg-accent text-white rounded-tr-none" 
                      : "bg-white text-foreground rounded-tl-none border border-primary/5 prose prose-sm max-w-none"
                  )}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={line.trim() === '' ? 'h-3' : 'mb-2 last:mb-0'}>{line}</p>
                    ))}
                  </div>
                </div>

                {/* Map/Doctor View if doctors found */}
                {msg.doctors && msg.doctors.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="col-span-full bg-primary/5 border border-primary/10 rounded-3xl p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <MapIcon className="text-primary h-6 w-6" />
                        <div>
                          <span className="text-sm font-black text-primary uppercase tracking-widest">Nearby Verified Specialists</span>
                          <p className="text-xs text-muted-foreground font-medium">Top medical professionals found in your area</p>
                        </div>
                      </div>
                      <Badge className="bg-primary text-white rounded-full px-3">{msg.doctors.length} Experts</Badge>
                    </div>
                    {msg.doctors.map((doc) => (
                      <Card key={doc.id} className="overflow-hidden border-none shadow-xl bg-white interactive-card rounded-[2rem] group">
                        <div className="h-32 bg-muted relative overflow-hidden">
                          <img 
                            src={`https://picsum.photos/seed/${doc.id}/600/300`} 
                            alt="Map Placeholder" 
                            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                               <MapPin className="text-primary h-7 w-7 animate-bounce" />
                            </div>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div>
                            <h4 className="font-black text-lg group-hover:text-primary transition-colors">{doc.name}</h4>
                            <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 border-none mt-1">
                               {doc.specialization}
                            </Badge>
                          </div>
                          <div className="space-y-2.5">
                            <div className="flex items-start gap-3 text-xs text-muted-foreground font-medium">
                              <MapPin size={14} className="shrink-0 mt-0.5 text-primary" />
                              <span className="line-clamp-2">{doc.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                              <Phone size={14} className="shrink-0 text-primary" />
                              <span>{doc.phone}</span>
                            </div>
                            <div className="flex flex-col gap-2 pt-2">
                              <div className="flex items-center gap-3 text-xs font-black text-foreground uppercase tracking-wider">
                                <Clock size={14} className="text-primary" />
                                <span>Clinic Timings</span>
                              </div>
                              <div className="pl-6 space-y-1">
                                {doc.availability.map((time, idx) => (
                                  <div key={idx} className="text-[10px] font-bold text-muted-foreground italic">• {time}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="w-full h-11 text-xs font-black rounded-full shadow-lg hover:shadow-primary/20">
                            Book Real Appointment
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 mr-auto items-center animate-in fade-in slide-in-from-left-4 duration-500">
                <Avatar className="h-10 w-10 bg-primary border-2 border-primary/20 shadow-lg">
                  <AvatarFallback className="text-white"><Bot size={18} /></AvatarFallback>
                </Avatar>
                <div className="bg-white px-6 py-4 rounded-[2rem] rounded-tl-none border border-primary/5 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Quick Actions Scroll Area */}
          <div className="px-8 py-4 border-t bg-white flex gap-3 overflow-x-auto no-scrollbar">
            {quickActions.map((action, i) => (
              <Button 
                key={i}
                variant="outline" 
                size="sm" 
                className="rounded-full shrink-0 h-10 gap-3 border-primary/10 hover:bg-primary/5 hover:text-primary transition-all font-bold interactive-card px-5"
                onClick={() => handleSend(action.prompt)}
              >
                <action.icon size={16} className="text-primary" />
                {action.label}
              </Button>
            ))}
          </div>

          <CardFooter className="p-6 bg-white border-t">
            <div className="flex w-full items-center gap-3 bg-muted/30 p-2 rounded-[2.5rem] border shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
              <Input 
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 h-12 flex-1 px-6 text-base font-medium"
                placeholder="Ask me anything about your health (Pan-India)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <Button 
                onClick={() => handleSend()} 
                className="rounded-full h-12 w-12 p-0 shadow-2xl transition-all hover:scale-105 active:scale-95"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ArrowUpCircle size={28} />}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Info Sidebar */}
        <div className="hidden lg:flex flex-col w-72 gap-8">
          <Card className="border-none shadow-2xl bg-gradient-to-br from-primary to-accent text-white rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="font-black text-xl tracking-tight">Pan-India Network</h3>
            <p className="text-sm font-medium opacity-90 leading-relaxed">
              Serving 200+ Indian cities including Kanpur, Lucknow, Mumbai, and Delhi with verified local doctor data.
            </p>
            <div className="pt-4 space-y-4">
              <div className="text-[10px] uppercase font-black tracking-widest opacity-60">Real-Time Status</div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                <span className="text-xs font-black">All Systems Live Bharat</span>
              </div>
            </div>
          </Card>
          
          <Card className="border-none shadow-2xl rounded-[2.5rem] p-8 bg-white interactive-card">
            <h4 className="font-black text-lg mb-6 tracking-tight">Indian Support Lines</h4>
            <div className="space-y-4">
              <Button variant="outline" size="lg" className="w-full justify-start text-xs h-12 rounded-2xl border-primary/5 hover:bg-primary/5 font-black group transition-all">
                <div className="h-8 w-8 bg-red-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                   <Phone size={16} className="text-red-600" />
                </div>
                Ambulance: 102
              </Button>
              <Button variant="outline" size="lg" className="w-full justify-start text-xs h-12 rounded-2xl border-primary/5 hover:bg-primary/5 font-black group transition-all">
                <div className="h-8 w-8 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                   <Phone size={16} className="text-blue-600" />
                </div>
                Blood Bank: 1910
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}