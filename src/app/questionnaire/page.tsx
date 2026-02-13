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
import { ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertTriangle, Activity, Languages } from 'lucide-react'
import { personalizedHealthInsights, PersonalizedHealthInsightsOutput } from '@/ai/flows/personalized-health-insights'

const TRANSLATIONS = {
  en: {
    title: "Health Assessment",
    subtitle: "Complete this quick form to get personalized insights and doctor recommendations.",
    step: (s: number, t: number) => `Step ${s} of ${t}`,
    complete: (p: number) => `${p.toFixed(0)}% Complete`,
    back: "Back",
    next: "Next",
    finish: "Finish Assessment",
    analyzing: "Analyzing...",
    basicInfo: "Basic Information",
    age: "Age",
    gender: "Gender",
    height: (h: number) => `Height: ${h} cm`,
    weight: (w: number) => `Weight: ${w} kg`,
    symptomsTitle: "Symptoms & Concerns",
    symptomsLabel: "What health issues are you currently experiencing?",
    symptomsPlaceholder: "e.g. Mild headache, persistent fatigue, back pain...",
    symptomsHint: "Be as specific as possible for better AI analysis.",
    lifestyleTitle: "Lifestyle & Diet",
    dietLabel: "Primary Diet",
    activityLabel: "Activity Level",
    historyTitle: "Medical History",
    historyLabel: "Known chronic conditions or past surgeries",
    historyPlaceholder: "e.g. Type 2 Diabetes, High Blood Pressure...",
    resultReady: "Your Health Assessment is Ready",
    resultSubtitle: "Based on your responses and AI analysis.",
    bioMetrics: "Bio Metrics",
    bmiScore: "BMI Score",
    aiInsights: "AI Health Insights",
    riskFactors: "Identified Risk Factors",
    speakDoctor: "Speak to a Recommended Doctor",
    takeAgain: "Take Assessment Again",
    male: "Male",
    female: "Female",
    other: "Other"
  },
  hi: {
    title: "स्वास्थ्य मूल्यांकन",
    subtitle: "व्यक्तिगत जानकारी और डॉक्टर की सिफारिशें प्राप्त करने के लिए यह त्वरित फ़ॉर्म भरें।",
    step: (s: number, t: number) => `चरण ${s} का ${t}`,
    complete: (p: number) => `${p.toFixed(0)}% पूर्ण`,
    back: "पीछे",
    next: "आगे",
    finish: "मूल्यांकन समाप्त करें",
    analyzing: "विश्लेषण हो रहा है...",
    basicInfo: "मूल जानकारी",
    age: "आयु",
    gender: "लिंग",
    height: (h: number) => `ऊंचाई: ${h} सेमी`,
    weight: (w: number) => `वजन: ${w} किलो`,
    symptomsTitle: "लक्षण और चिंताएं",
    symptomsLabel: "आप वर्तमान में किन स्वास्थ्य समस्याओं का सामना कर रहे हैं?",
    symptomsPlaceholder: "जैसे हल्का सिरदर्द, लगातार थकान, पीठ दर्द...",
    symptomsHint: "बेहतर AI विश्लेषण के लिए यथासंभव विशिष्ट रहें।",
    lifestyleTitle: "जीवनशैली और आहार",
    dietLabel: "प्राथमिक आहार",
    activityLabel: "गतिविधि का स्तर",
    historyTitle: "चिकित्सा इतिहास",
    historyLabel: "ज्ञात पुरानी स्थितियां या पिछली सर्जरी",
    historyPlaceholder: "जैसे टाइप 2 मधुमेह, उच्च रक्तचाप...",
    resultReady: "आपका स्वास्थ्य मूल्यांकन तैयार है",
    resultSubtitle: "आपकी प्रतिक्रियाओं और AI विश्लेषण के आधार पर।",
    bioMetrics: "बायो मेट्रिक्स",
    bmiScore: "बीएमआई स्कोर",
    aiInsights: "AI स्वास्थ्य अंतर्दृष्टि",
    riskFactors: "पहचाने गए जोखिम कारक",
    speakDoctor: "अनुशंसित डॉक्टर से बात करें",
    takeAgain: "फिर से मूल्यांकन लें",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य"
  }
}

export default function QuestionnairePage() {
  const router = useRouter()
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
    if (val < 18.5) return { label: language === 'en' ? 'Underweight' : 'कम वजन', color: 'text-blue-500' }
    if (val < 25) return { label: language === 'en' ? 'Normal weight' : 'सामान्य वजन', color: 'text-green-500' }
    if (val < 30) return { label: language === 'en' ? 'Overweight' : 'अधिक वजन', color: 'text-yellow-500' }
    return { label: language === 'en' ? 'Obese' : 'मोटापा', color: 'text-red-500' }
  }
  const bmiCat = getBmiCategory(parseFloat(bmi))

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2 bg-muted p-1 rounded-full border">
                <Button 
                  variant={language === 'en' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setLanguage('en')}
                  className="rounded-full text-xs h-8 px-4"
                >
                  English
                </Button>
                <Button 
                  variant={language === 'hi' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setLanguage('hi')}
                  className="rounded-full text-xs h-8 px-4 font-bold"
                >
                  हिंदी
                </Button>
              </div>
            </div>

            <div className="text-center space-y-2">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="text-3xl font-bold">{t.resultReady}</h1>
              <p className="text-muted-foreground">{t.resultSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 border-primary/20 bg-primary/5 shadow-lg rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    {t.bioMetrics}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">{t.bmiScore}</div>
                    <div className="text-4xl font-bold">{bmi}</div>
                    <div className={`text-sm font-semibold ${bmiCat.color}`}>{bmiCat.label}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">{language === 'en' ? 'Weight' : 'वजन'}</div>
                      <div className="font-bold">{formData.weight} kg</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">{language === 'en' ? 'Height' : 'ऊंचाई'}</div>
                      <div className="font-bold">{formData.height} cm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-accent/20 shadow-lg rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-lg">{t.aiInsights}</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                    {language === 'en' ? result.insights : result.insightsHindi}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-red-100 bg-red-50/50 shadow-md rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  {t.riskFactors}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-900/80 whitespace-pre-wrap leading-relaxed">
                  {language === 'en' ? result.riskFactors : result.riskFactorsHindi}
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="rounded-full px-8 h-12 shadow-lg" onClick={() => router.push('/doctors')}>
                {t.speakDoctor}
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12" onClick={() => {
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
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
             <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight">{t.title}</h1>
                <p className="text-muted-foreground text-sm">{t.subtitle}</p>
             </div>
             <div className="flex items-center gap-1 bg-muted p-1 rounded-full border">
                <Button 
                  variant={language === 'en' ? 'default' : 'ghost'} 
                  size="icon" 
                  onClick={() => setLanguage('en')}
                  className="rounded-full h-8 w-8 text-[10px]"
                >
                  EN
                </Button>
                <Button 
                  variant={language === 'hi' ? 'default' : 'ghost'} 
                  size="icon" 
                  onClick={() => setLanguage('hi')}
                  className="rounded-full h-8 w-8 text-[10px] font-bold"
                >
                  हि
                </Button>
             </div>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              <span>{t.step(step, totalSteps)}</span>
              <span>{t.complete(progress)}</span>
            </div>
          </div>

          <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="text-primary h-5 w-5" /> {t.basicInfo}
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="font-bold">{t.age}</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        className="h-12 rounded-xl"
                        value={formData.age} 
                        onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="font-bold">{t.gender}</Label>
                      <Select value={formData.gender} onValueChange={(val) => setFormData({...formData, gender: val})}>
                        <SelectTrigger id="gender" className="h-12 rounded-xl">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t.male}</SelectItem>
                          <SelectItem value="female">{t.female}</SelectItem>
                          <SelectItem value="other">{t.other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <Label className="font-bold">{t.height(formData.height)}</Label>
                    </div>
                    <Slider 
                      value={[formData.height]} 
                      min={100} max={250} step={1} 
                      onValueChange={([val]) => setFormData({...formData, height: val})}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="font-bold">{t.weight(formData.weight)}</Label>
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
                  <h2 className="text-xl font-bold">{t.symptomsTitle}</h2>
                  <div className="space-y-2">
                    <Label htmlFor="symptoms" className="font-bold">{t.symptomsLabel}</Label>
                    <Textarea 
                      id="symptoms" 
                      placeholder={t.symptomsPlaceholder} 
                      className="min-h-[150px] rounded-2xl"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground italic">{t.symptomsHint}</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold">{t.lifestyleTitle}</h2>
                  <div className="space-y-2">
                    <Label htmlFor="diet" className="font-bold">{t.dietLabel}</Label>
                    <Select value={formData.diet} onValueChange={(val) => setFormData({...formData, diet: val})}>
                      <SelectTrigger id="diet" className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">{language === 'en' ? 'Balanced' : 'संतुलित'}</SelectItem>
                        <SelectItem value="vegetarian">{language === 'en' ? 'Vegetarian' : 'शाकाहारी'}</SelectItem>
                        <SelectItem value="vegan">{language === 'en' ? 'Vegan' : 'वीगन'}</SelectItem>
                        <SelectItem value="keto">{language === 'en' ? 'Keto' : 'कीटो'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exercise" className="font-bold">{t.activityLabel}</Label>
                    <Select value={formData.exerciseLevel} onValueChange={(val) => setFormData({...formData, exerciseLevel: val})}>
                      <SelectTrigger id="exercise" className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">{language === 'en' ? 'Sedentary' : 'सुस्त'}</SelectItem>
                        <SelectItem value="moderate">{language === 'en' ? 'Moderate' : 'मध्यम'}</SelectItem>
                        <SelectItem value="active">{language === 'en' ? 'Active' : 'सक्रिय'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold">{t.historyTitle}</h2>
                  <div className="space-y-2">
                    <Label htmlFor="history" className="font-bold">{t.historyLabel}</Label>
                    <Textarea 
                      id="history" 
                      placeholder={t.historyPlaceholder} 
                      className="min-h-[150px] rounded-2xl"
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
                <ChevronLeft className="mr-2 h-4 w-4" /> {t.back}
              </Button>
              {step < totalSteps ? (
                <Button onClick={handleNext} className="rounded-full px-8 h-12 shadow-lg">
                  {t.next} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full px-10 h-12 bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.analyzing}
                    </>
                  ) : (
                    t.finish
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
