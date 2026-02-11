"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, Award, ShieldCheck, CreditCard, User } from 'lucide-react'
import { useFirestore, useUser } from '@/firebase'
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates'
import { collection } from 'firebase/firestore'

export default function DoctorRegistrationPage() {
  const router = useRouter()
  const { user } = useUser()
  const firestore = useFirestore()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: 'Cardiology',
    license: '',
    experience: 5,
    testAnswers: {} as Record<string, string>,
    paymentStatus: 'pending'
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const handleTestAnswer = (questionId: string, answer: string) => {
    setFormData(prev => ({
      ...prev,
      testAnswers: { ...prev.testAnswers, [questionId]: answer }
    }))
  }

  const handleSubmit = async () => {
    if (!firestore || !user) return
    setIsSubmitting(true)

    // Calculate mock score
    const score = Math.floor(Math.random() * 20) + 80 // Hard test, usually 80-100%

    addDocumentNonBlocking(collection(firestore, 'specialist_registrations'), {
      doctorId: user.uid,
      name: formData.name,
      specialization: formData.specialization,
      testScore: score,
      registrationFee: 5000,
      status: 'pending',
      specialistCategory: formData.specialization,
      createdAt: new Date().toISOString()
    })

    // Simulate delay for realism
    setTimeout(() => {
      setIsSubmitting(false)
      setStep(5) // Success step
    }, 2000)
  }

  const skillQuestions = [
    {
      id: 'q1',
      question: "Which of the following is the most common cause of heart failure in elderly patients?",
      options: ["Ischemic heart disease", "Congenital defects", "Atrial fibrillation", "Mitral stenosis"]
    },
    {
      id: 'q2',
      question: "What is the primary pharmacological management for an acute pulmonary embolism in hemodynamically stable patients?",
      options: ["Anticoagulation", "Thrombolysis", "Surgical embolectomy", "Aspirin only"]
    },
    {
      id: 'q3',
      question: "In the context of diabetic ketoacidosis (DKA), which electrolyte replacement is most critical alongside insulin therapy?",
      options: ["Potassium", "Sodium", "Calcium", "Magnesium"]
    }
  ]

  if (step === 5) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl text-center p-8 space-y-6">
            <div className="bg-green-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Application Submitted!</h2>
              <p className="text-muted-foreground">Your skill test score was 94%. We have received your registration fee. Your specialist profile is under final verification.</p>
            </div>
            <Button className="w-full rounded-full" onClick={() => router.push('/doctors')}>
              Return to Directory
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Specialist Doctor Registration</h1>
            <p className="text-muted-foreground">Join our elite panel of verified specialists. Complete the test and registration process.</p>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                {step === 1 && <User className="h-5 w-5 text-primary" />}
                {step === 2 && <Award className="h-5 w-5 text-primary" />}
                {step === 3 && <CreditCard className="h-5 w-5 text-primary" />}
                {step === 1 ? "Professional Profile" : step === 2 ? "Clinical Skill Test" : step === 3 ? "Registration Fee" : "Final Review"}
              </CardTitle>
              <CardDescription>Step {step} of {totalSteps}</CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      placeholder="Dr. Arjun Sharma" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Specialization</Label>
                      <Select value={formData.specialization} onValueChange={(v) => setFormData({...formData, specialization: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Medical License No.</Label>
                      <Input 
                        placeholder="MCI-12345"
                        value={formData.license}
                        onChange={(e) => setFormData({...formData, license: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input 
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 text-amber-800 text-sm">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <p>This is a mandatory clinical skill test. You must achieve at least 80% to be listed as a Verified Specialist.</p>
                  </div>
                  {skillQuestions.map((q, idx) => (
                    <div key={q.id} className="space-y-4">
                      <h3 className="font-bold text-sm leading-relaxed">{idx + 1}. {q.question}</h3>
                      <RadioGroup 
                        onValueChange={(v) => handleTestAnswer(q.id, v)}
                        className="grid grid-cols-1 gap-2"
                      >
                        {q.options.map((opt) => (
                          <div key={opt} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-primary/5 transition-colors">
                            <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                            <Label htmlFor={`${q.id}-${opt}`} className="flex-1 cursor-pointer font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center py-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Registration Fee</h3>
                    <p className="text-muted-foreground">Standard specialist listing and verification fee.</p>
                  </div>
                  <div className="text-5xl font-black text-primary">₹5,000</div>
                  <div className="p-4 bg-muted rounded-2xl text-left space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Verification & Credentialing</span>
                      <span>₹3,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform Listing (1 Year)</span>
                      <span>₹1,500</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹5,000</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-xl bg-green-50 text-green-700 text-xs">
                    <ShieldCheck size={16} /> Secure checkout powered by Razorpay
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 text-center py-8 animate-in fade-in slide-in-from-right-4">
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Ready to Submit</h3>
                    <p className="text-muted-foreground">Please review all your information. Once submitted, our board will verify your clinical score and medical license.</p>
                  </div>
                  <div className="text-left bg-muted p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between"><span className="text-muted-foreground">Name:</span> <span className="font-bold">{formData.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Specialty:</span> <span className="font-bold">{formData.specialization}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">License:</span> <span className="font-bold">{formData.license}</span></div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="bg-primary/5 p-6 border-t flex justify-between">
              <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isSubmitting}>
                <ChevronLeft className="mr-2" /> Back
              </Button>
              {step < totalSteps ? (
                <Button onClick={handleNext} className="rounded-full px-8">
                  Continue <ChevronRight className="ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full px-8">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
