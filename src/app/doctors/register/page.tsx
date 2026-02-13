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
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, Award, ShieldCheck, CreditCard, User, XCircle, AlertCircle } from 'lucide-react'
import { useFirestore, useUser } from '@/firebase'
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates'
import { collection } from 'firebase/firestore'

const CORRECT_ANSWERS: Record<string, string> = {
  'q1': "Ischemic heart disease",
  'q2': "Anticoagulation",
  'q3': "Potassium"
}

export default function DoctorRegistrationPage() {
  const router = useRouter()
  const { user } = useUser()
  const firestore = useFirestore()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'failed'>('idle')
  const [failureReason, setFailureReason] = useState('')
  const [finalScore, setFinalScore] = useState(0)
  
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

  const validateLicense = (license: string) => {
    const regex = /^MCI-\d{5,8}$/
    return regex.test(license)
  }

  const handleSubmit = async () => {
    if (!firestore || !user) return
    setIsSubmitting(true)

    let correctCount = 0
    Object.keys(CORRECT_ANSWERS).forEach(qId => {
      if (formData.testAnswers[qId] === CORRECT_ANSWERS[qId]) {
        correctCount++
      }
    })
    const scorePercentage = Math.round((correctCount / Object.keys(CORRECT_ANSWERS).length) * 100)
    setFinalScore(scorePercentage)

    const isLicenseValid = validateLicense(formData.license)

    // Simulate verification delay
    setTimeout(() => {
      setIsSubmitting(false)
      
      if (!isLicenseValid) {
        setRegistrationStatus('failed')
        setFailureReason('Invalid Medical License. Please ensure your license number follows the official format (e.g., MCI-12345).')
        return
      }

      if (scorePercentage < 80) {
        setRegistrationStatus('failed')
        setFailureReason(`Clinical test score of ${scorePercentage}% is below the eligibility threshold (80%).`)
        return
      }

      addDocumentNonBlocking(collection(firestore, 'specialist_registrations'), {
        doctorId: user.uid,
        name: formData.name,
        specialization: formData.specialization,
        testScore: scorePercentage,
        license: formData.license,
        registrationFee: 5000,
        status: 'pending',
        specialistCategory: formData.specialization,
        createdAt: new Date().toISOString()
      })

      setRegistrationStatus('success')
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

  if (registrationStatus === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl text-center p-8 space-y-6 rounded-[2.5rem]">
            <div className="bg-green-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Application Approved!</h2>
              <p className="text-muted-foreground">Congratulations! Your score was {finalScore}%. Your credentials have been verified and you are now part of our Elite Specialist Panel.</p>
            </div>
            <Button className="w-full rounded-full h-12" onClick={() => router.push('/specialists')}>
              Go to Specialist Panel
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  if (registrationStatus === 'failed') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl text-center p-8 space-y-6 rounded-[2.5rem]">
            <div className="bg-red-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-red-700">Not Eligible</h2>
              <p className="text-muted-foreground font-medium">{failureReason}</p>
              <p className="text-xs text-muted-foreground py-2 px-4 bg-muted rounded-xl">To maintain clinical excellence, only specialists who meet our rigorous standards are listed.</p>
            </div>
            <Button variant="outline" className="w-full rounded-full h-12" onClick={() => {
                setRegistrationStatus('idle')
                setStep(1)
            }}>
              Try Again
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => router.push('/doctors')}>
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
            <h1 className="text-3xl font-black tracking-tight">Specialist Registration</h1>
            <p className="text-muted-foreground">Elite status requires verified clinical excellence and valid credentials.</p>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-primary/5 border-b p-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                {step === 1 && <User className="h-5 w-5 text-primary" />}
                {step === 2 && <Award className="h-5 w-5 text-primary" />}
                {step === 3 && <CreditCard className="h-5 w-5 text-primary" />}
                {step === 4 && <ShieldCheck className="h-5 w-5 text-primary" />}
                {step === 1 ? "Professional Profile" : step === 2 ? "Clinical Skill Test" : step === 3 ? "Registration Fee" : "Final Verification"}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Full Name</Label>
                    <Input 
                      placeholder="Dr. Arjun Sharma" 
                      className="h-12 rounded-xl"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Specialization</Label>
                      <Select value={formData.specialization} onValueChange={(v) => setFormData({...formData, specialization: v})}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Medical License No. (MCI-XXXXX)</Label>
                      <Input 
                        placeholder="MCI-12345"
                        className="h-12 rounded-xl"
                        value={formData.license}
                        onChange={(e) => setFormData({...formData, license: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Years of Experience</Label>
                    <Input 
                      type="number"
                      className="h-12 rounded-xl"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3 text-amber-800 text-xs font-medium">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>Clinical Examination: You must answer all questions correctly to prove your expertise for the Elite Panel.</p>
                  </div>
                  {skillQuestions.map((q, idx) => (
                    <div key={q.id} className="space-y-4">
                      <h3 className="font-bold text-sm leading-relaxed">{idx + 1}. {q.question}</h3>
                      <RadioGroup 
                        onValueChange={(v) => handleTestAnswer(q.id, v)}
                        className="grid grid-cols-1 gap-3"
                      >
                        {q.options.map((opt) => (
                          <div key={opt} className="flex items-center space-x-2 border-2 p-4 rounded-2xl hover:bg-primary/5 transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                            <Label htmlFor={`${q.id}-${opt}`} className="flex-1 cursor-pointer font-medium">{opt}</Label>
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
                    <h3 className="text-2xl font-black">Registration Fee</h3>
                    <p className="text-muted-foreground">Standard specialist listing and credentialing fee.</p>
                  </div>
                  <div className="text-6xl font-black text-primary">₹5,000</div>
                  <div className="p-6 bg-muted/50 rounded-[2rem] text-left space-y-4 border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credentialing & Verification</span>
                      <span className="font-bold">₹3,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Elite Panel Membership (1 Year)</span>
                      <span className="font-bold">₹1,500</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-black">
                      <span>Total Due</span>
                      <span>₹5,000</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 border rounded-2xl bg-green-50 text-green-700 text-xs font-bold justify-center">
                    <ShieldCheck size={18} /> Secure Transaction via Razorpay
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 text-center py-8 animate-in fade-in slide-in-from-right-4">
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <ShieldCheck size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black">Ready for Verification</h3>
                    <p className="text-muted-foreground">By submitting, you authorize HealthWise to verify your medical license with the national registry.</p>
                  </div>
                  <div className="text-left bg-muted/50 p-6 rounded-2xl space-y-3 border">
                    <div className="flex justify-between"><span className="text-muted-foreground text-sm">Name:</span> <span className="font-bold">{formData.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground text-sm">Specialty:</span> <span className="font-bold">{formData.specialization}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground text-sm">License No:</span> <span className="font-bold">{formData.license}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground text-sm">Test Status:</span> <span className="font-bold text-green-600">Completed</span></div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="bg-primary/5 p-6 border-t flex justify-between">
              <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isSubmitting} className="rounded-full">
                <ChevronLeft className="mr-2" /> Back
              </Button>
              {step < totalSteps ? (
                <Button onClick={handleNext} className="rounded-full px-10 h-12 font-bold shadow-lg">
                  Next Step <ChevronRight className="ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full px-10 h-12 font-bold shadow-xl">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Verify & Register"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
