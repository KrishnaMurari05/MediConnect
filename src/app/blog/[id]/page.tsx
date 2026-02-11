"use client"

import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { MOCK_BLOGS } from '@/app/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Calendar, Clock, Share2, Bookmark } from 'lucide-react'
import Image from 'next/image'

export default function BlogDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const post = MOCK_BLOGS.find(p => p.id === id)

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Post not found</h2>
            <Button onClick={() => router.push('/blog')}>Back to Blogs</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-primary">
            <ChevronLeft size={20} className="mr-1" /> Back to Articles
          </Button>

          {/* Header */}
          <div className="space-y-6">
            <div className="flex gap-2">
              <Badge variant="secondary">{post.category}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold shadow-md">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-lg">{post.author}</div>
                  <div className="text-sm text-muted-foreground">{post.authorRole}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {post.readTime}
                </span>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                    <Share2 size={16} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                    <Bookmark size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover"
            />
          </div>

          {/* Content */}
          <article className="prose prose-lg prose-primary max-w-none">
            <div className="text-xl text-muted-foreground font-medium mb-12 italic border-l-4 border-primary pl-6">
              {post.excerpt}
            </div>
            <div className="whitespace-pre-wrap leading-relaxed text-foreground/80 space-y-6 text-lg">
              {post.content}
              <p>
                Maintaining a 'regular fit' lifestyle is the cornerstone of longevity. It is not about radical shifts but sustainable choices that honor your biology. Whether it is through mindful eating, consistent movement, or regular assessments, the goal is always the same: a vibrant, healthy life.
              </p>
              <p>
                As medical professionals, we advocate for these principles because we see their impact every day. Start small, stay consistent, and your body will thank you.
              </p>
            </div>
          </article>

          {/* Footer Section */}
          <div className="mt-20 p-10 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center gap-8">
            <div className="space-y-4 flex-1">
              <h3 className="text-2xl font-bold">Ready to take control of your health?</h3>
              <p className="text-muted-foreground">Get a personalized assessment and connect with experts like Dr. {post.author.split(' ').pop()}.</p>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/questionnaire">Start Your Assessment</Link>
              </Button>
            </div>
            <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-white shadow-xl">
               <Image src={`https://picsum.photos/seed/${post.id}/200/200`} alt="Call to action" fill className="object-cover" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}