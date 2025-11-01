import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const { count } = await supabase
      .from('article_likes')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', articleId)

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error('Error fetching like count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch like count' },
      { status: 500 }
    )
  }
}
