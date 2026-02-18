import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, Zap, HeartPulse, ArrowRight, Activity, Users, Star, Clock, Calendar, Sparkles } from 'lucide-react'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { MOCK_BLOGS } from '@/app/lib/mock-data'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'health-hero')
  const featuredBlogs = MOCK_BLOGS.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-40 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-2xl space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/10 text-primary text-sm font-bold shadow-sm backdrop-blur-sm">
                  <Sparkles size={16} className="text-accent animate-pulse" />
                  <span>Bharat's Most Advanced AI Health Partner</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[1] lg:-ml-1">
                  Healthcare <span className="text-primary italic relative">
                    Redefined.
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                  </span>
                </h1>
                <p className="text-2xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                  Experience seamless health assessments, instant AI insights, and direct expert connections designed for the modern Indian lifestyle.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 pt-4">
                  <Button asChild size="lg" className="h-16 px-10 text-lg rounded-full shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-2px] hover:shadow-primary/40 active:scale-95">
                    <Link href="/questionnaire">
                      Start Assessment <ArrowRight className="ml-2 h-6 w-6" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-full border-primary/20 hover:bg-white interactive-card">
                    <Link href="/doctors">Find Specialists</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-8 pt-8 text-sm font-bold text-muted-foreground/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 text-green-600"><ShieldCheck size={20} /></div>
                    <span>Data Privacy First</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600"><HeartPulse size={20} /></div>
                    <span>24/7 Virtual Care</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-500" />
                {heroImage && (
                  <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-[12px] border-white/50 floating aspect-[4/5] w-[90%] mx-auto">
                    <Image 
                      src={heroImage.imageUrl} 
                      alt={heroImage.description} 
                      fill
                      className="object-cover"
                      data-ai-hint={heroImage.imageHint}
                      priority
                    />
                    <div className="absolute bottom-8 left-8 right-8 bg-white/20 backdrop-blur-xl p-6 rounded-3xl border border-white/30">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center">
                             <Users size={24} />
                          </div>
                          <div>
                             <div className="text-white font-black text-xl">10k+ Indians</div>
                             <div className="text-white/80 text-sm font-bold">Trust HealthWise Every Day</div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Badge className="rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest bg-primary/10 text-primary border-none">Our Core Ecosystem</Badge>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Smart Care, Simplified.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">Integrated technology and human expertise working in harmony to keep you healthy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: Zap, 
                title: "Instant Health IQ", 
                desc: "Get immediate feedback on BMI, health risks, and metabolic markers using our GenAI engine.", 
                color: "bg-blue-50 text-blue-600" 
              },
              { 
                icon: Users, 
                title: "Precision Matching", 
                desc: "Connect with doctors specialized in your exact symptoms through our location-aware algorithm.", 
                color: "bg-purple-50 text-purple-600" 
              },
              { 
                icon: ShieldCheck, 
                title: "Hyper-Secure", 
                desc: "Your medical data is encrypted and handled with clinical-grade privacy protocols.", 
                color: "bg-green-50 text-green-600" 
              }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-xl bg-white interactive-card rounded-[2.5rem] p-4 group animate-in fade-in slide-in-from-bottom-12 duration-700 delay-[200ms]">
                <CardContent className="p-8 space-y-6">
                  <div className={`p-5 w-fit rounded-3xl ${feature.color} group-hover:scale-110 transition-transform`}>
                    <feature.icon size={40} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                  <div className="pt-4">
                    <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Blogs Section */}
        <section className="py-32 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700">
                <Badge className="rounded-full px-4 py-1 bg-accent/10 text-accent border-none font-bold uppercase tracking-widest text-xs">Medical Journals</Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Expert Perspectives</h2>
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">Evidence-based insights from India's leading medical practitioners.</p>
              </div>
              <Button asChild variant="ghost" className="hidden md:flex items-center gap-2 group text-primary font-black text-lg h-14 rounded-full px-8 bg-white shadow-sm border interactive-card">
                <Link href="/blog">
                  Read All Articles <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {featuredBlogs.map((post, idx) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-[400ms]">
                  <Card className="h-full group overflow-hidden border-none shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] transition-all rounded-[2.5rem] bg-white">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image 
                        src={post.image} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardHeader className="p-8">
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/80 mb-4 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-primary" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-0">
                      <div className="flex items-center gap-3 pt-6 border-t border-muted">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/5 shadow-inner">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black">{post.author}</span>
                           <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{post.authorRole}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 container mx-auto px-4">
          <div className="bg-primary text-white rounded-[3.5rem] p-12 md:p-24 relative overflow-hidden shadow-3xl animate-in zoom-in-95 duration-1000">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />
            
            <div className="relative z-10 max-w-3xl space-y-10">
              <Badge className="bg-white/20 text-white border-none px-6 py-2 rounded-full font-black tracking-widest text-xs uppercase">Join the Movement</Badge>
              <h2 className="text-5xl md:text-7xl font-black leading-[1] tracking-tight">
                Health shouldn't be a chore. Start your journey today.
              </h2>
              <p className="text-2xl text-white/80 leading-relaxed font-medium">
                Unlock personalized AI health insights and get access to Bharat's top specialist panel. Zero setup cost.
              </p>
              <div className="pt-6 flex flex-col sm:flex-row gap-6">
                <Button size="lg" variant="secondary" className="h-16 px-12 text-xl rounded-full font-black shadow-2xl transition-all hover:translate-y-[-4px] active:scale-95 bg-white text-primary hover:bg-white/90">
                  Join HealthWise Free
                </Button>
                <div className="flex -space-x-3 items-center">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-primary bg-muted overflow-hidden">
                       <img src={`https://picsum.photos/seed/${i+10}/100/100`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <span className="pl-6 text-sm font-bold text-white/60">+10k Members</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <HeartPulse size={24} />
              </div>
              <span className="text-2xl font-black text-primary tracking-tight">HealthWise</span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed font-medium italic">
              Empowering India with the world's most accessible, hyper-personalized digital healthcare ecosystem.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-lg tracking-tight">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground/80">
              <li><Link href="/questionnaire" className="hover:text-primary transition-colors">Digital Assessment</Link></li>
              <li><Link href="/doctors" className="hover:text-primary transition-colors">Specialist Network</Link></li>
              <li><Link href="/assistant" className="hover:text-primary transition-colors">AI Health Companion</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Research & Articles</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-lg tracking-tight">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground/80">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy & Data Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Clinical Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help Centre</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-lg tracking-tight">Headquarters</h4>
            <div className="space-y-2 text-sm font-bold text-muted-foreground/80 leading-relaxed">
              <p>12, MG Road, Silicon Valley Hub</p>
              <p>Bangalore, Karnataka 560001</p>
              <p className="pt-2 text-primary">support@healthwise.in</p>
              <p>+91 (80) 4500-CARE</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-20 pt-10 border-t text-center text-xs font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
          © 2024 HealthWise Pan-India. Dedicated to a Healthier Bharat.
        </div>
      </footer>
    </div>
  )
}