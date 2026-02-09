"use client"

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Calendar, ChevronRight, History } from 'lucide-react'
import { MOCK_CONSULTATIONS, MOCK_DOCTORS } from '@/app/lib/mock-data'
import Link from 'next/link'

export default function ConsultationsPage() {
  const [consultations] = useState(MOCK_CONSULTATIONS)

  const getDoctorName = (id: string) => {
    return MOCK_DOCTORS.find(d => d.id === id)?.name || 'Unknown Doctor'
  }

  const getDoctorAvatar = (id: string) => {
    return MOCK_DOCTORS.find(d => d.id === id)?.avatar || ''
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Consultations</h1>
            <Button asChild className="rounded-full">
              <Link href="/doctors">New Consultation</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {consultations.length > 0 ? (
              consultations.map((c) => (
                <Link key={c.id} href={`/consultations/${c.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer group shadow-sm border-none bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-md">
                        <img src={getDoctorAvatar(c.doctorId)} alt="Doctor" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{getDoctorName(c.doctorId)}</h3>
                          <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="rounded-full px-3">
                            {c.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MessageSquare size={14} />
                          {c.messages[c.messages.length - 1].text}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Today, 10:00 AM
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center py-20 space-y-6">
                <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <History size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">No consultations yet</h3>
                  <p className="text-muted-foreground">When you start a consultation with a doctor, it will appear here.</p>
                </div>
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/doctors">Find a Doctor</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}