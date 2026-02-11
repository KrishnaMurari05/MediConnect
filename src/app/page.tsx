import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, Zap, HeartPulse, ArrowRight, Activity, Users, Star } from 'lucide-react'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'health-hero')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-primary/5">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  <Activity size={16} />
                  <span>Now powered by Advanced AI Insights</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  Your Health, <span className="text-primary italic">Connected.</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Start your journey with a comprehensive health assessment. Get personalized AI insights and connect with top-tier medical professionals instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full">
                    <Link href="/questionnaire">
                      Start Health Check <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5">
                    <Link href="/doctors">Find a Specialist</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-primary h-5 w-5" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartPulse className="text-primary h-5 w-5" />
                    <span>24/7 Access</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                {heroImage && (
                  <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white aspect-[4/3] w-full">
                    <Image 
                      src={heroImage.imageUrl} 
                      alt={heroImage.description} 
                      fill
                      className="object-cover"
                      data-ai-hint={heroImage.imageHint}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Smart Care Designed for You</h2>
            <p className="text-lg text-muted-foreground">We combine cutting-edge technology with human expertise to deliver the best healthcare experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl bg-card hover:translate-y-[-8px] transition-transform">
              <CardContent className="p-8 space-y-4">
                <div className="p-3 w-fit rounded-2xl bg-primary/10 text-primary">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold">Instant Health Score</h3>
                <p className="text-muted-foreground">Complete our interactive questionnaire and get immediate feedback on your BMI, risk factors, and wellness tips.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-card hover:translate-y-[-8px] transition-transform">
              <CardContent className="p-8 space-y-4">
                <div className="p-3 w-fit rounded-2xl bg-accent/10 text-accent">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold">Expert Matching</h3>
                <p className="text-muted-foreground">Our intelligent algorithm connects you with doctors specialized in your specific needs, saving you time and stress.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-card hover:translate-y-[-8px] transition-transform">
              <CardContent className="p-8 space-y-4">
                <div className="p-3 w-fit rounded-2xl bg-green-500/10 text-green-600">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold">Secure Consultations</h3>
                <p className="text-muted-foreground">Chat with doctors, receive prescriptions, and manage medical reports through our encrypted, secure platform.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Proof */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold">Trusted by thousands of healthy individuals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">10k+</div>
                <div className="text-primary-foreground/70">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-primary-foreground/70">Verified Doctors</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-primary-foreground/70">App Rating</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24h</div>
                <div className="text-primary-foreground/70">Avg. Consultation Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="bg-accent text-white rounded-3xl p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 max-w-2xl space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to take the first step towards a healthier you?</h2>
                <p className="text-xl text-accent-foreground/90">Join HealthWise Connect today and experience healthcare that actually listens.</p>
                <div className="pt-4">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full font-bold">
                    Join for Free
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary text-white">
                <HeartPulse size={16} />
              </div>
              <span className="text-lg font-bold text-primary">HealthWise</span>
            </Link>
            <p className="text-sm text-muted-foreground">Making modern healthcare accessible, affordable, and personalized for everyone, everywhere.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/questionnaire">Health Check</Link></li>
              <li><Link href="/doctors">Doctors</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/cookie">Cookie Policy</Link></li>
              <li><Link href="/hipaa">HIPAA Compliance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@healthwise.com</li>
              <li>+1 (555) HEALTH-01</li>
              <li>123 Wellness Ave, Suite 100</li>
              <li>San Francisco, CA 94103</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © 2024 HealthWise Connect. All rights reserved. Medical emergency? Please call local emergency services immediately.
        </div>
      </footer>
    </div>
  )
}