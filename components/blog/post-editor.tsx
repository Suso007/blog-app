"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  coverImage?: string | null
  published: boolean
}

interface PostEditorProps {
  post: Post | null
  onSave: () => void
}

const CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Travel',
  'Food',
  'Health',
  'Education',
]

export function PostEditor({ post, onSave }: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    coverImage: '',
    published: false,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        coverImage: post.coverImage || '',
        published: post.published,
      })
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Technology',
        coverImage: '',
        published: false,
      })
    }
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = post ? `/api/posts/${post.id}` : '/api/posts'
      const method = post ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success!',
          description: `Post ${post ? 'updated' : 'created'} successfully.`,
        })
        onSave()
      } else {
        throw new Error('Failed to save post')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save post. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Enter post title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Textarea
          id="excerpt"
          placeholder="Brief description of your post"
          value={formData.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
          required
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          placeholder="Write your post content here..."
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          required
          disabled={loading}
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange('category', value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.coverImage}
            onChange={(e) => handleChange('coverImage', e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) => handleChange('published', e.target.checked)}
          disabled={loading}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="published" className="cursor-pointer">
          Publish immediately
        </Label>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : post ? (
            'Update Post'
          ) : (
            'Create Post'
          )}
        </Button>
      </div>
    </form>
  )
}
