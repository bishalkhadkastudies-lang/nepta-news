import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { isSaved: false },
        { status: 200 }
      )
    }

    const { articleId } = await request.json()

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    // Check if article is saved
    const { data, error } = await supabase
      .from('saved_articles')
      .select('id')
      .eq('user_id', user.id)
      .eq('article_id', articleId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json(
      { isSaved: !!data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error checking saved article:', error)
    return NextResponse.json(
      { isSaved: false },
      { status: 200 }
    )
  }
}
