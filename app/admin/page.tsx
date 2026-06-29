"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, LogOut, Eye, CheckSquare, Square, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { PostEditor } from '@/components/blog/post-editor'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  coverImage?: string | null
  published: boolean
  createdAt: Date
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchAllPosts()
  }, [])

  // Clear selection if posts change (e.g. after delete)
  useEffect(() => {
    setSelectedIds((prev) => {
      const postIds = new Set(posts.map((p) => p.id))
      const next = new Set([...prev].filter((id) => postIds.has(id)))
      return next
    })
  }, [posts])

  const fetchAllPosts = async () => {
    try {
      const response = await fetch('/api/posts?all=true')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      })
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleCreateNew = () => {
    setEditingPost(null)
    setEditorOpen(true)
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setEditorOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Post deleted successfully.',
        })
        fetchAllPosts()
      } else {
        throw new Error('Failed to delete post')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleSavePost = () => {
    setEditorOpen(false)
    setEditingPost(null)
    fetchAllPosts()
  }

  // ── Selection helpers ──────────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const isAllSelected = posts.length > 0 && selectedIds.size === posts.length
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < posts.length

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(posts.map((p) => p.id)))
    }
  }

  // ── Bulk delete ────────────────────────────────────────────────────────────

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    setConfirmBulkDelete(false)
    setBulkDeleting(true)

    try {
      const response = await fetch('/api/posts/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [...selectedIds] }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Deleted!',
          description: `${data.deleted} post${data.deleted !== 1 ? 's' : ''} deleted successfully.`,
        })
        setSelectedIds(new Set())
        fetchAllPosts()
      } else {
        throw new Error('Failed to bulk delete')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete selected posts. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setBulkDeleting(false)
    }
  }

  return (
    <div className="min-h-screen gradient-background">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Manage Posts</h2>
              <p className="text-muted-foreground">
                Create, edit, and manage your blog posts
              </p>
            </div>
            <Button onClick={handleCreateNew} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Post
            </Button>
          </div>

          {/* ── Bulk-action toolbar (animated) ── */}
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div
                key="bulk-toolbar"
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="mb-5 flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3 text-sm font-medium">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span>
                    <span className="font-bold text-destructive">{selectedIds.size}</span>{' '}
                    post{selectedIds.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedIds(new Set())}
                    className="h-8 text-xs"
                  >
                    Clear selection
                  </Button>
                  {confirmBulkDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Are you sure?</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 text-xs"
                        disabled={bulkDeleting}
                        onClick={handleBulkDelete}
                      >
                        {bulkDeleting ? 'Deleting…' : 'Yes, delete'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setConfirmBulkDelete(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setConfirmBulkDelete(true)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Delete selected
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center">
                <p className="text-xl text-muted-foreground mb-4">
                  No posts yet. Create your first post to get started!
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {/* ── Select-all row ── */}
              <div className="flex items-center gap-3 px-1 pb-1">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={isAllSelected ? 'Deselect all' : 'Select all'}
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-primary" />
                  ) : isIndeterminate ? (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded border-2 border-primary bg-primary/20">
                      <span className="w-2 h-0.5 bg-primary rounded" />
                    </span>
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  <span>
                    {isAllSelected
                      ? 'Deselect all'
                      : `Select all (${posts.length})`}
                  </span>
                </button>
              </div>

              {/* ── Post cards ── */}
              {posts.map((post) => {
                const isSelected = selectedIds.has(post.id)
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                  >
                    <Card
                      className={`transition-all duration-150 ${
                        isSelected
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:shadow-md'
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <div className="pt-1 flex-shrink-0">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelect(post.id)}
                              aria-label={`Select "${post.title}"`}
                              id={`select-post-${post.id}`}
                            />
                          </div>

                          {/* Post info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <CardTitle className="text-base leading-snug">
                                {post.title}
                              </CardTitle>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  post.published
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}
                              >
                                {post.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                            <CardDescription>
                              {post.category} •{' '}
                              {new Date(post.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(post)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pl-12">
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {post.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </main>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? 'Update your blog post details below.'
                : 'Fill in the details to create a new blog post.'}
            </DialogDescription>
          </DialogHeader>
          <PostEditor post={editingPost} onSave={handleSavePost} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
