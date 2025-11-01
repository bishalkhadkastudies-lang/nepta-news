import { createClient } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { articleId, content } = await request.json()

    if (!articleId || !content) {
      return NextResponse.json(
        { error: 'Article ID and content are required' },
        { status: 400 }
      )
    }

    if (content.trim().length === 0 || content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be between 1 and 1000 characters' },
        { status: 400 }
      )
    }

    const { data: comment, error } = await supabase
      .from('article_comments')
      .insert({
        user_id: user.id,
        article_id: articleId,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
