import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { articleId, limit = 10, offset = 0 } = await request.json()

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const { data: comments, error } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    // Get total count
    const { count } = await supabase
      .from('article_comments')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', articleId)

    return NextResponse.json({
      comments: comments || [],
      total: count || 0,
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
