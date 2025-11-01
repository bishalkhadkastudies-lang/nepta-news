import { createClient } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    if (!user) {
      return NextResponse.json({ isLiked: false })
    }

    const { articleId } = await request.json()

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const { data: like } = await supabase
      .from('article_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('article_id', articleId)
      .single()

    return NextResponse.json({ isLiked: !!like })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json({ isLiked: false })
  }
}
