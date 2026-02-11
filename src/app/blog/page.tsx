"use client"

import Navbar from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MOCK_BLOGS } from '@/app/lib/mock-data'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Health Insights & Expert Blogs</h1>
            <p className="text-xl text-muted-foreground">
              Learn from the world's leading medical professionals about maintaining a fit and healthy lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_BLOGS.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="h-full group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                  <div className="aspect-video relative overflow-hidden">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 hover:bg-primary shadow-md">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-2">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="p-6 pt-4 flex items-center justify-between border-t mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{post.author}</span>
                        <span className="text-[10px] text-muted-foreground">{post.authorRole}</span>
                      </div>
                    </div>
                    <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 transition-transform" />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}