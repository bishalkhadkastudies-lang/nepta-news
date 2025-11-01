import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-server'

export async function DELETE(request: NextRequest) {
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

    // Delete from saved_articles table
    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('user_id', user.id)
      .eq('article_id', articleId)

    if (error) throw error

    return NextResponse.json(
      { message: 'Article removed from saved' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error removing saved article:', error)
    return NextResponse.json(
      { error: 'Failed to remove article' },
      { status: 500 }
    )
  }
}
