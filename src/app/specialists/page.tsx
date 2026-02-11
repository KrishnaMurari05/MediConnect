
"use client"

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search, Star, MessageSquare, ShieldCheck, Crown, ArrowRight, Zap } from 'lucide-react'
import { MOCK_DOCTORS } from '@/app/lib/mock-data'
import Link from 'next/link'

export default function SpecialistsPage() {
  const [search, setSearch] = useState('')
  
  // Filtering for "fav" specialists or top-rated ones for demo
  const specialists = MOCK_DOCTORS.filter(d => d.rating >= 4.9)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 px-4 py-1 rounded-full font-bold">
              <Crown className="mr-2 h-4 w-4" /> Elite Specialist Panel
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Consult with India's Finest</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our verified specialists have passed rigorous clinical skill tests. Get direct access to expert medical minds for personalized care.
            </p>
          </div>

          {/* Featured Specialist */}
          <Card className="bg-gradient-to-r from-primary to-accent border-none text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
             <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl shrink-0 rotate-3">
                  <img src={MOCK_DOCTORS[0].avatar} alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-6 flex-1 text-center md:text-left">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">{MOCK_DOCTORS[0].name}</h2>
                    <p className="text-xl text-white/80 font-medium">{MOCK_DOCTORS[0].specialization}</p>
                  </div>
                  <p className="text-white/70 text-lg leading-relaxed max-w-xl">
                    "My mission is to provide accessible, world-class cardiac care to every corner of Bharat. Specialized consultation is now just a click away."
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                     <div className="bg-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-sm">
                       <Star className="text-amber-400 h-4 w-4 fill-amber-400" />
                       <span className="font-bold">4.9/5.0</span>
                     </div>
                     <div className="bg-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-sm">
                       <ShieldCheck className="text-green-400 h-4 w-4" />
                       <span className="font-bold">Clinical Verified</span>
                     </div>
                  </div>
                  <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-10 h-14 text-lg">
                    <Link href={`/specialists/chat/pay/${MOCK_DOCTORS[0].id}`}>
                      Start Premium Chat <Zap className="ml-2 h-5 w-5 fill-current" />
                    </Link>
                  </Button>
                </div>
             </CardContent>
          </Card>

          {/* Specialist Directory */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold px-4">Available Specialists</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialists.map((doc) => (
                <Card key={doc.id} className="border-none shadow-lg hover:shadow-2xl transition-all rounded-[2rem] overflow-hidden group">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <Avatar className="h-16 w-16 border-2 border-primary/10 shadow-inner">
                        <AvatarImage src={doc.avatar} />
                        <AvatarFallback>{doc.name[0]}</AvatarFallback>
                      </Avatar>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none">
                        Verified Expert
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2 space-y-4">
                    <div>
                      <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{doc.name}</h4>
                      <p className="text-accent font-bold text-sm uppercase tracking-wide">{doc.specialization}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold pt-2 border-t">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" /> {doc.rating}
                      </div>
                      <div className="text-muted-foreground">
                        Chat Fee: <span className="text-foreground">₹{doc.fees + 500}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-muted/30">
                    <Button asChild className="w-full rounded-full h-12 font-bold group-hover:bg-primary transition-all">
                      <Link href={`/specialists/chat/pay/${doc.id}`}>
                        Consult Specialist <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
