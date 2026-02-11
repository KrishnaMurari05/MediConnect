
"use client"

import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MOCK_DOCTORS } from '@/app/lib/mock-data'
import { ShieldCheck, CreditCard, ChevronLeft, Lock, Info, Star, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useUser, useFirestore } from '@/firebase'
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates'
import { collection } from 'firebase/firestore'

export default function SpecialistPaymentPage() {
  const { doctorId } = useParams()
  const router = useRouter()
  const { user } = useUser()
  const firestore = useFirestore()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const doctor = MOCK_DOCTORS.find(d => d.id === doctorId)
  const chatFee = (doctor?.fees || 1000) + 500

  const handlePayment = async () => {
    if (!firestore || !user || !doctor) return
    setIsProcessing(true)

    try {
      // Create a new chat session
      const chatRef = await addDocumentNonBlocking(collection(firestore, 'specialist_chat_sessions'), {
        userId: user.uid,
        specialistId: doctor.id,
        messages: ["System: Payment successful. You can now start your consultation."],
        feeCharged: chatFee,
        topic: `${doctor.specialization} Consultation`,
        status: 'active',
        createdAt: new Date().toISOString()
      })

      // Create payment record
      addDocumentNonBlocking(collection(firestore, 'payments'), {
        userId: user.uid,
        doctorId: doctor.id,
        amount: chatFee,
        stripeId: 'mock_specialist_pay_' + Math.random().toString(36).substr(2, 9),
        status: 'completed',
        createdAt: new Date().toISOString()
      })

      // Navigate to the newly created session
      if (chatRef) {
        router.push(`/specialists/chat/${chatRef.id}`)
      } else {
        // Fallback if reference wasn't returned immediately for some reason
        router.push('/specialists/my-chats')
      }
    } catch (error) {
      console.error("Payment failed", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!doctor) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-xl">
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-full">
            <ChevronLeft className="mr-2" /> Back to Specialists
          </Button>

          <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-primary/5 p-8 border-b">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                   <img src={doctor.avatar} alt={doctor.name} className="h-full w-full object-cover" />
                </div>
                <div>
                   <CardTitle className="text-2xl">{doctor.name}</CardTitle>
                   <CardDescription className="flex items-center gap-1 font-bold text-accent">
                     {doctor.specialization} • <Star size={14} className="fill-amber-400 text-amber-400" /> {doctor.rating}
                   </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-muted-foreground">Specialist Consultation Fee</span>
                  <span className="font-bold">₹{chatFee}</span>
                </div>
                <div className="bg-muted/50 p-4 rounded-2xl text-sm space-y-2">
                   <div className="flex items-start gap-2 text-muted-foreground">
                     <Info size={16} className="shrink-0 mt-0.5" />
                     <p>Includes direct chat access and a digital prescription if required.</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                 <h4 className="font-bold flex items-center gap-2">
                   <CreditCard size={18} /> Payment Method
                 </h4>
                 <div className="grid grid-cols-1 gap-3">
                   <div className="border-2 border-primary bg-primary/5 p-4 rounded-2xl flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                         <CreditCard className="text-primary" />
                       </div>
                       <div>
                         <p className="font-bold">Saved Card</p>
                         <p className="text-xs text-muted-foreground">Visa ending in 4242</p>
                       </div>
                     </div>
                     <div className="h-4 w-4 rounded-full border-4 border-primary" />
                   </div>
                 </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                 <Lock size={12} /> SSL Encrypted & Secure Transaction
              </div>
            </CardContent>

            <CardFooter className="p-8 bg-primary/5 border-t">
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing} 
                className="w-full h-14 rounded-full text-lg font-bold shadow-xl shadow-primary/20"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Processing Securely...
                  </>
                ) : (
                  `Pay ₹${chatFee} & Start Chat`
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center px-8 text-xs text-muted-foreground">
             By proceeding, you agree to our Terms of Service for digital consultations. This is not for emergency medical services.
          </div>
        </div>
      </main>
    </div>
  )
}
