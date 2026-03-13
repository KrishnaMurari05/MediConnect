"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeartPulse, Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '@/firebase'
import { initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from '@/firebase/non-blocking-login'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      initiateEmailSignIn(auth, email, password)
      // Redirection handled by onAuthStateChanged in Provider/Navbar
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Auth Error",
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      initiateEmailSignUp(auth, email, password)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Auth Error",
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestEntry = () => {
    initiateAnonymousSignIn(auth)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden py-24">
        {/* Background Accents */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />

        <div className="w-full max-w-[450px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 floating">
              <HeartPulse size={32} fill="white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">Welcome to HealthWise</h1>
            <p className="text-muted-foreground font-medium">Your gateway to a healthier Bharat.</p>
          </div>

          <Card className="border-none shadow-3xl rounded-[2.5rem] overflow-hidden bg-white">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-none h-14 bg-muted/30 p-1">
                <TabsTrigger value="login" className="rounded-[1.5rem] data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-[1.5rem] data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">Sign Up</TabsTrigger>
              </TabsList>

              <CardContent className="p-8 space-y-6">
                <TabsContent value="login">
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="arjun@healthwise.in" 
                            className="h-14 pl-12 rounded-2xl border-primary/5 bg-muted/20 focus:bg-white" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••" 
                            className="h-14 pl-12 rounded-2xl border-primary/5 bg-muted/20 focus:bg-white" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-full font-black text-lg shadow-xl shadow-primary/20" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin" /> : "Access Portal"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="arjun@healthwise.in" 
                          className="h-14 rounded-2xl border-primary/5 bg-muted/20 focus:bg-white" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Choose Password</Label>
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="Min. 8 characters" 
                          className="h-14 rounded-2xl border-primary/5 bg-muted/20 focus:bg-white" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-full font-black text-lg shadow-xl shadow-primary/20" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground font-bold">Or</span></div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-full font-bold border-primary/10 hover:bg-primary/5"
                  onClick={handleGuestEntry}
                  disabled={isLoading}
                >
                  <Sparkles size={18} className="mr-2 text-accent" /> Continue as Guest
                </Button>
              </CardContent>
              <CardFooter className="bg-muted/10 p-6 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <ShieldCheck className="inline-block mr-2 h-3 w-3" /> Secure Health Cloud Authorization
              </CardFooter>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  )
}
