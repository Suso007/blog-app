import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

// GET - Fetch all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'desc'
    const showAll = searchParams.get('all') === 'true'

    const where: Record<string, unknown> =
      category && category !== 'All' ? { category } : {}

    // Only filter by published:true for public requests
    if (!showAll) {
      where.published = true
    }

    console.log(where)
    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        createdAt: sortBy === 'asc' ? 'asc' : 'desc',
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}


// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, excerpt, content, category, coverImage, published } = body

    const slug = generateSlug(title)

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        published: published || false,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
