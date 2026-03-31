import { notFound } from 'next/navigation'
import { Navbar } from '@/components/blog/navbar'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { BlogDetailClient } from './blog-detail-client'

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
  })

  if (!post || !post.published) {
    return null
  }

  return post
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen gradient-background">
      <Navbar />
      
      <BlogDetailClient post={post} />

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Modern Blog. Crafted with passion.</p>
        </div>
      </footer>
    </div>
  )
}
