import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch top 5 most liked articles
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        categories (name),
        content
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(5)

    if (error) {
      throw error
    }

    // Transform articles with like counts
    const transformedArticles = (articles || []).map((article: any, index: number) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: Array.isArray(article.categories) 
        ? article.categories[0]?.name || 'News'
        : article.categories?.name || 'News',
      readTime: Math.ceil((article.content?.split(' ').length || 0) / 200) || 5,
      rank: index + 1
    }))

    return NextResponse.json({
      articles: transformedArticles
    })
  } catch (error) {
    console.error('Error fetching trending articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending articles', articles: [] },
      { status: 500 }
    )
  }
}
