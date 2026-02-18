"use client"

import Link from 'next/link'
import { Heart, User, Menu, X, ClipboardList, Stethoscope, Sparkles, BookOpen, Crown, MessageSquare, HeartPulse } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/', icon: Heart },
    { name: 'Assessment', href: '/questionnaire', icon: ClipboardList },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'Specialists', href: '/specialists', icon: Crown },
    { name: 'AI Companion', href: '/assistant', icon: Sparkles },
    { name: 'Library', href: '/blog', icon: BookOpen },
  ]

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-500 py-4",
      scrolled 
        ? "bg-white/80 backdrop-blur-xl border-b shadow-xl shadow-primary/5 py-3" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-accent group-hover:shadow-accent/30">
                <HeartPulse fill="white" size={24} />
              </div>
              <span className="text-2xl font-black text-primary tracking-tight leading-none group-hover:text-accent transition-colors">
                HealthWise
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-black text-muted-foreground/80 transition-all duration-300 hover:text-primary flex items-center gap-2 relative group py-2"
              >
                <link.icon size={18} className={cn(
                  "transition-transform duration-300 group-hover:scale-125",
                  link.name === 'Specialists' ? 'text-amber-500' : 
                  link.name === 'AI Companion' ? 'text-accent' : ''
                )} />
                <span className="tracking-tight">{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
            <div className="ml-6 flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-2xl border bg-white shadow-sm h-12 w-12 interactive-card">
                    <User size={24} className="text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-[2rem] p-3 shadow-3xl border-primary/5">
                  <DropdownMenuLabel className="px-4 py-3 text-lg font-black tracking-tight">My Command Centre</DropdownMenuLabel>
                  <DropdownMenuSeparator className="mx-2" />
                  <DropdownMenuItem asChild className="rounded-2xl p-3 focus:bg-primary/5 cursor-pointer group">
                    <Link href="/specialists/my-chats" className="flex items-center">
                      <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-black text-sm">Specialist Consults</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active 1-on-1 Chats</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-2xl p-3 focus:bg-primary/5 cursor-pointer group">
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-black text-sm">Clinical History</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Full Patient Record</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-2" />
                  <DropdownMenuItem className="rounded-2xl p-3 focus:bg-destructive/5 text-destructive cursor-pointer font-black justify-center tracking-widest uppercase text-xs">
                    Terminate Session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-2xl text-muted-foreground hover:text-primary hover:bg-white interactive-card focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden animate-in slide-in-from-top duration-500 overflow-hidden">
          <div className="mx-4 mt-4 px-4 pt-6 pb-8 space-y-4 bg-white rounded-[3rem] shadow-3xl border border-primary/5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-6 py-4 rounded-3xl text-lg font-black text-muted-foreground transition-all hover:text-primary hover:bg-primary/5 active:scale-95"
              >
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "p-3 rounded-2xl bg-muted/50",
                    link.name === 'Specialists' ? 'text-amber-500 bg-amber-50' : 
                    link.name === 'AI Companion' ? 'text-accent bg-accent/5' : ''
                  )}>
                    <link.icon size={24} />
                  </div>
                  {link.name}
                </div>
              </Link>
            ))}
            <Link
                href="/specialists/my-chats"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-4 rounded-3xl text-lg font-black text-muted-foreground hover:text-primary hover:bg-primary/5"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                    <MessageSquare size={24} />
                  </div>
                  My Premium Chats
                </div>
              </Link>
          </div>
        </div>
      )}
    </nav>
  )
}