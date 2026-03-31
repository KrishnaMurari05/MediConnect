"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertTriangle, Activity, Sparkles, Heart, ShieldCheck, Pill, Stethoscope, Home, Utensils, Lock } from 'lucide-react'
import { personalizedHealthInsights, PersonalizedHealthInsightsOutput } from '@/ai/flows/personalized-health-insights'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/firebase'

const TRANSLATIONS = {
  en: {
    title: "Health Assessment",
    subtitle: "Complete our hyper-personalized assessment for clinical-grade AI insights.",
    step: (s: number, t: number) => `Phase ${s} / ${t}`,
    complete: (p: number) => `${p.toFixed(0)}% Analyzed`,
    back: "Previous",
    next: "Continue",
    finish: "Generate Analysis",
    analyzing: "AI Processing...",
    basicInfo: "Metabolic Baseline",
    age: "Current Age",
    gender: "Gender Identity",
    height: (h: number) => `Stature: ${h} cm`,
    weight: (w: number) => `Body Mass: ${w} kg`,
    symptomsTitle: "Current Physiological Concerns",
    symptomsLabel: "Detail any symptoms or recurring issues",
    symptomsPlaceholder: "e.g. Occasional morning dizziness, persistent knee fatigue...",
    symptomsHint: "Detailed descriptions improve the accuracy of our AI diagnostics.",
    lifestyleTitle: "Dietary & Lifestyle Patterns",
    dietLabel: "Nutrition Strategy",
    activityLabel: "Physical Activity Level",
    historyTitle: "Clinical History",
    historyLabel: "Existing conditions or surgical history",
    historyPlaceholder: "e.g. Managed Type 2 Diabetes, appendectomy (2018)...",
    resultReady: "Your Health Portfolio is Ready",
    resultSubtitle: "Advanced AI analysis based on your unique clinical profile.",
    bioMetrics: "Body Composition",
    bmiScore: "BMI Index",
    aiInsights: "Personalized AI Protocol",
    riskFactors: "Critical Vigilance Areas",
    homeTherapy: "Home-Based Therapy",
    medicationTips: "Medication & Remedies",
    prepareDiet: "Should I prepare a personalized diet for you?",
    prepareDietBtn: "Prepare My Diet Plan",
    speakDoctor: "Connect with a Specialist",
    takeAgain: "Recalibrate Assessment",
    male: "Male",
    female: "Female",
    other: "Other"
  },
  hi: {
    title: "स्वास्थ्य मूल्यांकन",
    subtitle: "AI आधारित व्यक्तिगत स्वास्थ्य अंतर्दृष्टि के लिए यह मूल्यांकन पूरा करें।",
    step: (s: number, t: number) => `चरण ${s} / ${t}`,
    complete: (p: number) => `${p.toFixed(0)}% विश्लेषण`,
    back: "पीछे",
    next: "आगे बढ़ें",
    finish: "विश्लेषण प्राप्त करें",
    analyzing: "AI विश्लेषण हो रहा है...",
    basicInfo: "बुनियादी जानकारी",
    age: "आयु",
    gender: "लिंग",
    height: (h: number) => `ऊंचाई: ${h} सेमी`,
    weight: (w: number) => `वजन: ${w} किलो`,
    symptomsTitle: "लक्षण और शारीरिक चिंताएं",
    symptomsLabel: "अपनी स्वास्थ्य समस्याओं का विवरण दें",
    symptomsPlaceholder: "जैसे थकान, पीठ दर्द, नींद की कमी...",
    symptomsHint: "AI की सटीकता के लिए विस्तार से लिखें।",
    lifestyleTitle: "जीवनशैली और आहार",
    dietLabel: "आहार के प्रकार",
    activityLabel: "शारीरिक गतिविधि",
    historyTitle: "चिकित्सा इतिहास",
    historyLabel: "पुरानी बीमारियाँ या सर्जरी",
    historyPlaceholder: "जैसे मधुमेह, उच्च रक्तचाप...",
    resultReady: "आपका स्वास्थ्य पोर्टफोलियो तैयार है",
    resultSubtitle: "AI विश्लेषण आपकी अद्वितीय प्रोफ़ाइल के आधार पर।",
    bioMetrics: "शारीरिक विवरण",
    bmiScore: "BMI स्कोर",
    aiInsights: "AI स्वास्थ्य सलाह",
    riskFactors: "सावधानी के क्षेत्र",
    homeTherapy: "घर-आधारित चिकित्सा",
    medicationTips: "दवा और उपचार",
    prepareDiet: "क्या मुझे आपके लिए एक व्यक्तिगत आहार (Diet) तैयार करना चाहिए?",
    prepareDietBtn: "मेरा डाइट प्लान बनाएं",
    speakDoctor: "विशेषज्ञ से बात करें",
    takeAgain: "पुनः मूल्यांकन लें",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य"
  }
}

export default function QuestionnairePage() {
  const router = useRouter()
  const { user, isUserLoading } = useUser()
  const [step, setStep] = useState(1)
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<PersonalizedHealthInsightsOutput | null>(null)

  const t = TRANSLATIONS[language]

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
    if (val < 18.5) return { label: language === 'en' ? 'Underweight' : 'कम वजन', color: 'text-blue-600', bg: 'bg-blue-50' }
    if (val < 25) return { label: language === 'en' ? 'Optimal' : 'सामान्य', color: 'text-green-600', bg: 'bg-green-50' }
    if (val < 30) return { label: language === 'en' ? 'Overweight' : 'अधिक वजन', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { label: language === 'en' ? 'Obese' : 'मोटापा', color: 'text-red-600', bg: 'bg-red-50' }
  }
  const bmiCat = getBmiCategory(parseFloat(bmi))

  const handlePrepareDiet = () => {
    const prompt = `Based on my recent assessment (Age: ${formData.age}, BMI: ${bmi}, Diet: ${formData.diet}, Activity: ${formData.exerciseLevel}), please prepare a detailed Indian diet plan for me.`
    router.push(`/assistant?prompt=${encodeURIComponent(prompt)}`)
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-3xl text-center p-12 space-y-8 rounded-[3rem] bg-white/70 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-700">
            <div className="mx-auto h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary floating">
              <Lock size={40} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tight">Login Required</h2>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">Please sign in to your MediConnect account to start your personalized clinical assessment.</p>
            </div>
            <Button asChild size="lg" className="w-full h-14 rounded-full font-black text-lg shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all">
              <Link href="/login">Sign In to Continue</Link>
            </Button>
            <div className="flex items-center justify-center gap-3 pt-4 text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
               <ShieldCheck size={14} /> Clinical Grade Data Authorization
            </div>
          </Card>
        </main>
      </div>
    )
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex justify-end">
              <div className="flex items-center gap-1 bg-white p-1 rounded-full border shadow-sm">
                <Button 
                  variant={language === 'en' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setLanguage('en')}
                  className="rounded-full text-xs h-9 px-6 font-black"
                >
                  ENGLISH
                </Button>
                <Button 
                  variant={language === 'hi' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setLanguage('hi')}
                  className="rounded-full text-xs h-9 px-6 font-black"
                >
                  हिन्दी
                </Button>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="mx-auto h-24 w-24 bg-green-100 rounded-[2rem] flex items-center justify-center shadow-xl shadow-green-200/50 animate-bounce">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">{t.resultReady}</h1>
                <p className="text-xl text-muted-foreground font-medium">{t.resultSubtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 border-none bg-white shadow-2xl rounded-[3rem] p-4 interactive-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <Activity className="h-6 w-6 text-primary" />
                    {t.bioMetrics}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className={`p-8 rounded-[2.5rem] ${bmiCat.bg} border border-white/50 text-center space-y-2`}>
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{t.bmiScore}</div>
                    <div className="text-6xl font-black tracking-tighter">{bmi}</div>
                    <Badge className={`rounded-full px-6 py-1 font-black uppercase text-[10px] tracking-widest ${bmiCat.color} bg-white/80 border-none shadow-sm`}>
                       {bmiCat.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-muted">
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{language === 'en' ? 'Weight' : 'वजन'}</div>
                      <div className="text-2xl font-black">{formData.weight} <span className="text-sm font-medium">kg</span></div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{language === 'en' ? 'Height' : 'ऊंचाई'}</div>
                      <div className="text-2xl font-black">{formData.height} <span className="text-sm font-medium">cm</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white interactive-card flex flex-col">
                <CardHeader className="bg-primary/5 p-8 border-b border-primary/5">
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-accent" />
                    {t.aiInsights}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 flex-1 overflow-y-auto no-scrollbar">
                  <div className="prose prose-blue max-w-none">
                    <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed font-medium text-lg italic border-l-4 border-primary/20 pl-8">
                      {language === 'en' ? result.insights : result.insightsHindi}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white interactive-card">
                <CardHeader className="p-8 border-b border-muted">
                  <CardTitle className="text-xl font-black flex items-center gap-3 text-primary">
                    <Home className="h-6 w-6" />
                    {t.homeTherapy}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="whitespace-pre-wrap text-foreground/70 leading-relaxed font-medium">
                    {language === 'en' ? result.homeTherapy : result.homeTherapyHindi}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-2xl rounded-[3rem] bg-white interactive-card">
                <CardHeader className="p-8 border-b border-muted">
                  <CardTitle className="text-xl font-black flex items-center gap-3 text-accent">
                    <Pill className="h-6 w-6" />
                    {t.medicationTips}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="whitespace-pre-wrap text-foreground/70 leading-relaxed font-medium">
                    {language === 'en' ? result.medicationTips : result.medicationTipsHindi}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none bg-gradient-to-br from-red-50 to-white shadow-xl rounded-[3rem] p-4 relative overflow-hidden group interactive-card">
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-3 text-red-700 uppercase tracking-tight">
                  <AlertTriangle className="h-7 w-7" />
                  {t.riskFactors}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-red-900/80 whitespace-pre-wrap leading-relaxed font-bold text-lg">
                  {language === 'en' ? result.riskFactors : result.riskFactorsHindi}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-primary to-accent text-white rounded-[3rem] p-8 md:p-12 shadow-3xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-black tracking-tight">{t.prepareDiet}</h3>
                  <p className="text-white/80 font-medium">Get a clinical-grade Indian nutrition plan based on your recent metabolic profile.</p>
                </div>
                <Button 
                  onClick={handlePrepareDiet}
                  size="lg" 
                  variant="secondary" 
                  className="h-16 px-10 rounded-full font-black text-lg shadow-2xl transition-all hover:translate-y-[-4px] bg-white text-primary hover:bg-white/90"
                >
                  <Utensils className="mr-3 h-6 w-6" /> {t.prepareDietBtn}
                </Button>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Button size="lg" className="h-16 rounded-full px-12 text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-4px] active:scale-95" onClick={() => router.push('/doctors')}>
                {t.speakDoctor}
              </Button>
              <Button variant="outline" size="lg" className="h-16 rounded-full px-12 text-lg font-black border-primary/10 hover:bg-white interactive-card" onClick={() => {
                setResult(null)
                setStep(1)
              }}>
                {t.takeAgain}
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
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
             <div className="space-y-3">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">{t.title}</h1>
                <p className="text-lg text-muted-foreground font-medium max-w-lg">{t.subtitle}</p>
             </div>
             <div className="flex items-center gap-1 bg-white p-1 rounded-full border shadow-sm shrink-0 self-end md:self-auto">
                <Button 
                  variant={language === 'en' ? 'default' : 'ghost'} 
                  size="icon" 
                  onClick={() => setLanguage('en')}
                  className="rounded-full h-10 w-10 text-[10px] font-black"
                >
                  EN
                </Button>
                <Button 
                  variant={language === 'hi' ? 'default' : 'ghost'} 
                  size="icon" 
                  onClick={() => setLanguage('hi')}
                  className="rounded-full h-10 w-10 text-[10px] font-black"
                >
                  हि
                </Button>
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
               <div className="space-y-1">
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t.step(step, totalSteps)}</div>
                  <div className="text-2xl font-black text-primary">
                     {step === 1 ? t.basicInfo : step === 2 ? t.symptomsTitle : step === 3 ? t.lifestyleTitle : t.historyTitle}
                  </div>
               </div>
               <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-1">{t.complete(progress)}</span>
            </div>
            <Progress value={progress} className="h-3 bg-primary/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(63,81,181,0.3)]" />
            </Progress>
          </div>

          <Card className="shadow-3xl border-none rounded-[3.5rem] overflow-hidden bg-white animate-in slide-in-from-bottom-8 duration-700">
            <CardContent className="p-10 md:p-16">
              {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="age" className="font-black text-sm uppercase tracking-wider text-muted-foreground">{t.age}</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        className="h-14 rounded-2xl border-primary/5 bg-muted/20 focus:bg-white text-lg font-black px-6 transition-all"
                        value={formData.age} 
                        onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="gender" className="font-black text-sm uppercase tracking-wider text-muted-foreground">{t.gender}</Label>
                      <Select value={formData.gender} onValueChange={(val) => setFormData({...formData, gender: val})}>
                        <SelectTrigger id="gender" className="h-14 rounded-2xl border-primary/5 bg-muted/20 focus:bg-white text-lg font-black px-6 transition-all">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-primary/5">
                          <SelectItem value="male" className="font-bold">{t.male}</SelectItem>
                          <SelectItem value="female" className="font-bold">{t.female}</SelectItem>
                          <SelectItem value="other" className="font-bold">{t.other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-6 pt-4">
                    <div className="flex justify-between items-center">
                      <Label className="font-black text-sm uppercase tracking-wider text-primary">{t.height(formData.height)}</Label>
                    </div>
                    <Slider 
                      value={[formData.height]} 
                      min={100} max={250} step={1} 
                      onValueChange={([val]) => setFormData({...formData, height: val})}
                      className="py-4"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Label className="font-black text-sm uppercase tracking-wider text-primary">{t.weight(formData.weight)}</Label>
                    </div>
                    <Slider 
                      value={[formData.weight]} 
                      min={30} max={250} step={1} 
                      onValueChange={([val]) => setFormData({...formData, weight: val})}
                      className="py-4"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-4">
                    <Label htmlFor="symptoms" className="font-black text-sm uppercase tracking-wider text-primary">{t.symptomsLabel}</Label>
                    <Textarea 
                      id="symptoms" 
                      placeholder={t.symptomsPlaceholder} 
                      className="min-h-[200px] rounded-3xl border-primary/5 bg-muted/20 focus:bg-white text-lg font-medium p-8 transition-all resize-none"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    />
                    <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-2xl text-xs text-primary font-bold border border-primary/10 italic">
                       <Sparkles size={14} className="animate-pulse" />
                       {t.symptomsHint}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-4">
                    <Label htmlFor="diet" className="font-black text-sm uppercase tracking-wider text-primary">{t.dietLabel}</Label>
                    <Select value={formData.diet} onValueChange={(val) => setFormData({...formData, diet: val})}>
                      <SelectTrigger id="diet" className="h-16 rounded-3xl border-primary/5 bg-muted/20 focus:bg-white text-lg font-black px-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-3xl border-primary/5">
                        <SelectItem value="balanced" className="font-bold py-3">{language === 'en' ? 'Balanced / Omnivorous' : 'संतुलित'}</SelectItem>
                        <SelectItem value="vegetarian" className="font-bold py-3">{language === 'en' ? 'Lacto-Vegetarian' : 'शाकाहारी'}</SelectItem>
                        <SelectItem value="vegan" className="font-bold py-3">{language === 'en' ? 'Plant-Based / Vegan' : 'वीगन'}</SelectItem>
                        <SelectItem value="keto" className="font-bold py-3">{language === 'en' ? 'Ketogenic / Low-Carb' : 'कीटो'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="exercise" className="font-black text-sm uppercase tracking-wider text-primary">{t.activityLabel}</Label>
                    <Select value={formData.exerciseLevel} onValueChange={(val) => setFormData({...formData, exerciseLevel: val})}>
                      <SelectTrigger id="exercise" className="h-16 rounded-3xl border-primary/5 bg-muted/20 focus:bg-white text-lg font-black px-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-3xl border-primary/5">
                        <SelectItem value="sedentary" className="font-bold py-3">{language === 'en' ? 'Sedentary (Minimal movement)' : 'सुस्त'}</SelectItem>
                        <SelectItem value="moderate" className="font-bold py-3">{language === 'en' ? 'Moderate (3-4 days exercise)' : 'मध्यम'}</SelectItem>
                        <SelectItem value="active" className="font-bold py-3">{language === 'en' ? 'Active (Elite physical activity)' : 'सक्रिय'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-4">
                    <Label htmlFor="history" className="font-black text-sm uppercase tracking-wider text-primary">{t.historyLabel}</Label>
                    <Textarea 
                      id="history" 
                      placeholder={t.historyPlaceholder} 
                      className="min-h-[200px] rounded-3xl border-primary/5 bg-muted/20 focus:bg-white text-lg font-medium p-8 transition-all resize-none"
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/10 p-10 md:p-16 flex justify-between gap-6 border-t border-muted">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={step === 1 || isSubmitting}
                className="rounded-full h-14 px-8 font-black text-primary hover:bg-primary/5 transition-all"
              >
                <ChevronLeft className="mr-3 h-5 w-5" /> {t.back}
              </Button>
              {step < totalSteps ? (
                <Button onClick={handleNext} className="rounded-full h-14 px-12 text-lg font-black shadow-2xl transition-all hover:translate-y-[-2px] active:scale-95">
                  {t.next} <ChevronRight className="ml-3 h-5 w-5" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full h-14 px-14 text-lg font-black bg-accent hover:bg-accent/90 shadow-2xl shadow-accent/30 transition-all hover:translate-y-[-4px] active:scale-95">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      {t.analyzing}
                    </>
                  ) : (
                    t.finish
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <div className="flex items-center justify-center gap-4 text-muted-foreground/40 font-black text-[10px] uppercase tracking-[0.3em]">
             <ShieldCheck size={14} /> HIPAA Secure
             <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
             <Heart size={14} /> Made for Bharat
          </div>
        </div>
      </div>
    </div>
  )
}