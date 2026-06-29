import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

// DELETE - Bulk delete posts by IDs
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { ids } = body as { ids: string[] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'No post IDs provided' },
        { status: 400 }
      )
    }

    const result = await prisma.post.deleteMany({
      where: {
        id: { in: ids },
      },
    })

    return NextResponse.json({ success: true, deleted: result.count })
  } catch (error) {
    console.error('Error bulk deleting posts:', error)
    return NextResponse.json(
      { error: 'Failed to delete posts' },
      { status: 500 }
    )
  }
}
