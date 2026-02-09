"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertTriangle, Activity } from 'lucide-react'
import { personalizedHealthInsights, PersonalizedHealthInsightsOutput } from '@/ai/flows/personalized-health-insights'

export default function QuestionnairePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<PersonalizedHealthInsightsOutput | null>(null)

  const [formData, setFormData] = useState({
    age: 30,
    weight: 70,
    height: 175,
    gender: 'other',
    symptoms: '',
    diet: 'balanced',
    exerciseLevel: 'moderate',
    medicalHistory: ''
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps))
  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Calling the provided GenAI flow
      const insights = await personalizedHealthInsights({
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        symptoms: formData.symptoms || 'No specific symptoms reported.',
        diet: formData.diet,
        exerciseLevel: formData.exerciseLevel,
        medicalHistory: formData.medicalHistory || 'No significant medical history reported.'
      })
      setResult(insights)
    } catch (error) {
      console.error("Failed to get insights", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const bmi = (formData.weight / ((formData.height / 100) ** 2)).toFixed(1)
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500' }
    if (val < 25) return { label: 'Normal weight', color: 'text-green-500' }
    if (val < 30) return { label: 'Overweight', color: 'text-yellow-500' }
    return { label: 'Obese', color: 'text-red-500' }
  }
  const bmiCat = getBmiCategory(parseFloat(bmi))

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="text-3xl font-bold">Your Health Assessment is Ready</h1>
              <p className="text-muted-foreground">Based on your responses and AI analysis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Bio Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">BMI Score</div>
                    <div className="text-4xl font-bold">{bmi}</div>
                    <div className={`text-sm font-semibold ${bmiCat.color}`}>{bmiCat.label}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Weight</div>
                      <div className="font-bold">{formData.weight} kg</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Height</div>
                      <div className="font-bold">{formData.height} cm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg">AI Health Insights</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {result.insights}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-red-100 bg-red-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Identified Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-900/80 whitespace-pre-wrap">{result.riskFactors}</p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="rounded-full px-8 h-12" onClick={() => router.push('/doctors')}>
                Speak to a Recommended Doctor
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12" onClick={() => {
                setResult(null)
                setStep(1)
              }}>
                Take Assessment Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Health Assessment</h1>
            <p className="text-muted-foreground">Complete this quick form to get personalized insights and doctor recommendations.</p>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase">
              <span>Step {step} of {totalSteps}</span>
              <span>{progress.toFixed(0)}% Complete</span>
            </div>
          </div>

          <Card className="shadow-xl border-none">
            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold">Basic Information</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        value={formData.age} 
                        onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(val) => setFormData({...formData, gender: val})}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <Label>Height: {formData.height} cm</Label>
                    </div>
                    <Slider 
                      value={[formData.height]} 
                      min={100} max={250} step={1} 
                      onValueChange={([val]) => setFormData({...formData, height: val})}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Weight: {formData.weight} kg</Label>
                    </div>
                    <Slider 
                      value={[formData.weight]} 
                      min={30} max={250} step={1} 
                      onValueChange={([val]) => setFormData({...formData, weight: val})}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold">Symptoms & Concerns</h2>
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">What health issues are you currently experiencing?</Label>
                    <Textarea 
                      id="symptoms" 
                      placeholder="e.g. Mild headache, persistent fatigue, back pain..." 
                      className="min-h-[150px]"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground italic">Be as specific as possible for better AI analysis.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold">Lifestyle & Diet</h2>
                  <div className="space-y-2">
                    <Label htmlFor="diet">Primary Diet</Label>
                    <Select value={formData.diet} onValueChange={(val) => setFormData({...formData, diet: val})}>
                      <SelectTrigger id="diet">
                        <SelectValue placeholder="Select diet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced / Everything</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Keto / Low Carb</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exercise">Activity Level</Label>
                    <Select value={formData.exerciseLevel} onValueChange={(val) => setFormData({...formData, exerciseLevel: val})}>
                      <SelectTrigger id="exercise">
                        <SelectValue placeholder="Select activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (Little/no exercise)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-4 days/week)</SelectItem>
                        <SelectItem value="active">Active (Daily exercise)</SelectItem>
                        <SelectItem value="athlete">High Performance / Athlete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold">Medical History</h2>
                  <div className="space-y-2">
                    <Label htmlFor="history">Known chronic conditions or past surgeries</Label>
                    <Textarea 
                      id="history" 
                      placeholder="e.g. Type 2 Diabetes, High Blood Pressure, Knee Surgery in 2018..." 
                      className="min-h-[150px]"
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 p-8 flex justify-between">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={step === 1 || isSubmitting}
                className="rounded-full"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < totalSteps ? (
                <Button onClick={handleNext} className="rounded-full px-8">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full px-8 bg-accent hover:bg-accent/90">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Finish Assessment"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}