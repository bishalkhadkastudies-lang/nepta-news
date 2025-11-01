import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Check if articles table exists and has data
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, slug, status, category_id')
      .limit(5)

    // Check categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(5)

    // Check if there are published articles
    const { data: publishedArticles, error: publishedError } = await supabase
      .from('articles')
      .select('id, title, slug, status')
      .eq('status', 'published')
      .limit(5)

    return NextResponse.json({
      articles: {
        data: articles,
        error: articlesError,
        count: articles?.length || 0
      },
      categories: {
        data: categories,
        error: categoriesError,
        count: categories?.length || 0
      },
      publishedArticles: {
        data: publishedArticles,
        error: publishedError,
        count: publishedArticles?.length || 0
      }
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
