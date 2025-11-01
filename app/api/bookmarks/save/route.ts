import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-server'

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

    // Insert into saved_articles table
    const { data, error } = await supabase
      .from('saved_articles')
      .insert([
        {
          user_id: user.id,
          article_id: articleId
        }
      ])
      .select()

    if (error) {
      // If it's a unique constraint error, article is already saved
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Article already saved' },
          { status: 200 }
        )
      }
      throw error
    }

    return NextResponse.json(
      { message: 'Article saved successfully', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving article:', error)
    return NextResponse.json(
      { error: 'Failed to save article' },
      { status: 500 }
    )
  }
}
