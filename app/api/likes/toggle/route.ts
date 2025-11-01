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

    const { articleId } = await request.json()

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('article_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('article_id', articleId)
      .single()

    if (existingLike) {
      // Unlike
      await supabase
        .from('article_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId)

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await supabase
        .from('article_likes')
        .insert({
          user_id: user.id,
          article_id: articleId,
        })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
