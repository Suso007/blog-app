"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Calendar, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface BlogCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    category: string
    coverImage?: string | null
    createdAt: Date
  }
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
          {post.coverImage && (
            <div className="relative h-48 overflow-hidden bg-muted">
              <motion.img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}
          <CardContent className="p-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>{post.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <motion.span 
              className="text-sm font-medium text-primary inline-flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              Read more →
            </motion.span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
