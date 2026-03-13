"use client"

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ShieldAlert, CheckCircle2, XCircle, Clock, Loader2, Search, Filter, Stethoscope, Award } from 'lucide-react'
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase'
import { collection, query, orderBy, doc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'

export default function AdminPage() {
  const firestore = useFirestore()
  const [search, setSearch] = useState('')

  const regsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(
      collection(firestore, 'specialist_registrations'),
      orderBy('createdAt', 'desc')
    )
  }, [firestore])

  const { data: registrations, isLoading } = useCollection(regsQuery)

  const handleStatusUpdate = (id: string, newStatus: 'approved' | 'rejected') => {
    if (!firestore) return
    const regRef = doc(firestore, 'specialist_registrations', id)
    updateDocumentNonBlocking(regRef, { status: newStatus })
  }

  const filteredRegs = registrations?.filter(reg => 
    reg.name.toLowerCase().includes(search.toLowerCase()) ||
    reg.specialization.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="space-y-12">
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-4 py-1 rounded-full font-black text-[10px] tracking-widest uppercase">
                Internal Command Portal
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Clinical Verification</h1>
              <p className="text-muted-foreground text-lg font-medium">Review and verify specialist credentials for the elite panel.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                  placeholder="Search applicants..." 
                  className="pl-10 h-12 rounded-2xl border-primary/10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                 />
               </div>
               <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-primary/10">
                 <Filter size={20} />
               </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Pending Reviews", count: registrations?.filter(r => r.status === 'pending').length || 0, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Total Verified", count: registrations?.filter(r => r.status === 'approved').length || 0, color: "text-green-600", bg: "bg-green-50" },
              { label: "Total Applications", count: registrations?.length || 0, color: "text-primary", bg: "bg-primary/5" },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-xl rounded-[2rem] bg-white p-6">
                 <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                   <p className={`text-4xl font-black ${stat.color}`}>{stat.count}</p>
                 </div>
              </Card>
            ))}
          </div>

          {/* Registration Table */}
          <Card className="border-none shadow-3xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-muted/30 p-8 border-b">
              <CardTitle className="flex items-center gap-3">
                <Stethoscope className="text-primary h-6 w-6" />
                Specialist Applicants
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="animate-spin h-10 w-10 text-primary" />
                </div>
              ) : filteredRegs && filteredRegs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10">
                      <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest">Doctor</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">Specialty</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">License</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">Test Score</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                      <TableHead className="px-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegs.map((reg) => (
                      <TableRow key={reg.id} className="hover:bg-muted/5 transition-colors">
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                              {reg.name[0]}
                            </div>
                            <div className="font-bold">{reg.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-accent/5 text-accent border-none font-bold uppercase text-[10px]">
                            {reg.specialization}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold text-muted-foreground">{reg.license}</TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                             <div className={`h-2 w-12 rounded-full bg-muted overflow-hidden`}>
                               <div className="h-full bg-green-500" style={{ width: `${reg.testScore}%` }} />
                             </div>
                             <span className="font-black text-xs">{reg.testScore}%</span>
                           </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              "rounded-full px-3 text-[10px] font-black uppercase",
                              reg.status === 'approved' ? "bg-green-100 text-green-700" :
                              reg.status === 'rejected' ? "bg-red-100 text-red-700" :
                              "bg-amber-100 text-amber-700"
                            )}
                          >
                            {reg.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 text-right space-x-2">
                          {reg.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="rounded-full h-9 border-green-200 text-green-700 hover:bg-green-50"
                                onClick={() => handleStatusUpdate(reg.id, 'approved')}
                              >
                                <CheckCircle2 size={16} className="mr-1" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="rounded-full h-9 border-red-200 text-red-700 hover:bg-red-50"
                                onClick={() => handleStatusUpdate(reg.id, 'rejected')}
                              >
                                <XCircle size={16} className="mr-1" /> Deny
                              </Button>
                            </>
                          )}
                          {reg.status !== 'pending' && (
                             <Button variant="ghost" size="sm" className="rounded-full h-9 text-muted-foreground italic">
                               Finalized
                             </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="mx-auto h-20 w-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    <ShieldAlert size={32} />
                  </div>
                  <h3 className="text-xl font-black">No pending requests</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">All specialist registration applications have been processed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
