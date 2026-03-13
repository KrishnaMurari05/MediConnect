"use client"

import Link from 'next/link'
import { Heart, User, Menu, X, ClipboardList, Stethoscope, Sparkles, BookOpen, Crown, MessageSquare, HeartPulse, LogIn, LogOut, ShieldAlert } from 'lucide-react'
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
import { useUser, useAuth } from '@/firebase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useUser()
  const auth = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    auth.signOut()
  }

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
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl border bg-white shadow-sm h-12 w-12 interactive-card">
                      <User size={24} className="text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 rounded-[2rem] p-3 shadow-3xl border-primary/5">
                    <DropdownMenuLabel className="px-4 py-3">
                      <div className="font-black text-lg tracking-tight">My Command Centre</div>
                      <div className="text-[10px] text-muted-foreground font-bold truncate max-w-[220px]">{user.email || 'Anonymous Patient'}</div>
                    </DropdownMenuLabel>
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
                    <DropdownMenuItem asChild className="rounded-2xl p-3 focus:bg-primary/5 cursor-pointer group">
                      <Link href="/admin" className="flex items-center">
                        <div className="h-10 w-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-black text-sm">Admin Portal</div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Panel Management</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="mx-2" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="rounded-2xl p-3 focus:bg-destructive/5 text-destructive cursor-pointer group font-black justify-center tracking-widest uppercase text-xs"
                    >
                      <LogOut size={16} className="mr-2 group-hover:scale-110 transition-transform" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="h-12 px-8 rounded-full font-black shadow-lg interactive-card">
                  <Link href="/login">
                    Sign In <LogIn className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
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
            {!user ? (
               <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-4 rounded-3xl text-lg font-black text-white bg-primary shadow-xl"
              >
                <div className="flex items-center justify-center gap-3">
                  <LogIn size={24} /> Sign In
                </div>
              </Link>
            ) : (
              <div className="space-y-4 border-t pt-4">
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
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left px-6 py-4 rounded-3xl text-lg font-black text-red-600 hover:bg-red-50"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-2xl bg-red-50">
                      <LogOut size={24} />
                    </div>
                    Sign Out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
