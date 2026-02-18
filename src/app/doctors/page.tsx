"use client"

import { useState, useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search, MapPin, Star, Filter, Calendar, MessageSquare, Award, Stethoscope } from 'lucide-react'
import { MOCK_DOCTORS, Doctor } from '@/app/lib/mock-data'
import Link from 'next/link'

export default function DoctorsPage() {
  const [search, setSearch] = useState('')
  const doctors = MOCK_DOCTORS

  const filteredDoctors = useMemo(() => {
    const query = search.toLowerCase()
    return doctors.filter(doc => 
      doc.name.toLowerCase().includes(query) ||
      doc.specialization.toLowerCase().includes(query) ||
      doc.location.toLowerCase().includes(query)
    )
  }, [search, doctors])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Banner for Registration */}
          <Card className="bg-primary overflow-hidden border-none rounded-3xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 max-w-xl text-white text-center md:text-left">
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1 rounded-full">
                  Doctor Opportunities
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Become a Verified Specialist</h2>
                <p className="text-white/80">Register as a specialist on Bharat's most trusted health platform. Pass our medical skill test and join our elite specialist panel.</p>
                <Button asChild variant="secondary" size="lg" className="rounded-full font-bold h-12 px-8">
                  <Link href="/doctors/register">Apply Now <Award className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
              <div className="hidden lg:block w-48 h-48 bg-white/10 rounded-3xl rotate-12 flex items-center justify-center">
                <Stethoscope className="w-24 h-24 text-white opacity-40" />
              </div>
            </CardContent>
          </Card>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight">Our Network of Doctors</h1>
              <p className="text-muted-foreground text-lg">Choose from top-rated professionals verified by HealthWise.</p>
            </div>
            <div className="w-full md:w-96 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, specialty, or city..." 
                  className="pl-10 h-12 rounded-full border-primary/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-primary/20">
                <Filter size={20} />
              </Button>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <Card key={doc.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all hover:translate-y-[-4px]">
                <CardHeader className="bg-primary/5 p-6 flex flex-row gap-4 items-start border-b border-primary/10">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                    <AvatarImage src={doc.avatar} />
                    <AvatarFallback>{doc.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{doc.name}</CardTitle>
                    <p className="text-sm font-semibold text-accent">{doc.specialization}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={12} />
                      {doc.location}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-2 py-0.5 rounded text-sm font-bold">
                      <Star size={14} fill="currentColor" />
                      {doc.rating}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">{doc.experience} years</span> exp.
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doc.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doc.availability.slice(0, 2).map((time, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-secondary/50 font-normal">
                        <Calendar size={10} className="mr-1" /> {time}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex gap-3">
                  <Button asChild className="flex-1 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <Link href={`/consultations/new?doc=${doc.id}`}>
                      Book Consultation
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20 text-primary hover:bg-primary/5">
                    <MessageSquare size={18} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold">No doctors found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
              <Button variant="link" onClick={() => setSearch('')}>Clear all search terms</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
