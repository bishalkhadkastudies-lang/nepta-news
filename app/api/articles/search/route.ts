import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const author = searchParams.get('author') || ''
    const sortBy = searchParams.get('sort') || 'date' // date, relevance, popular
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let queryBuilder = supabase
      .from('articles')
      .select(`
        id,
        title,
        excerpt,
        image_url,
        content,
        category_id,
        categories (name),
        author_id,
        authors (name, profile_picture_url),
        published_at,
        status
      `)
      .eq('status', 'published')

    // Search by title or excerpt
    if (query.trim()) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,excerpt.ilike.%${query}%`
      )
    }

    // Filter by category
    if (category) {
      queryBuilder = queryBuilder.eq('categories.name', category)
    }

    // Filter by author
    if (author) {
      queryBuilder = queryBuilder.eq('authors.name', author)
    }

    // Sort
    if (sortBy === 'date') {
      queryBuilder = queryBuilder.order('published_at', { ascending: false })
    } else if (sortBy === 'popular') {
      queryBuilder = queryBuilder.order('published_at', { ascending: false })
    }

    // Pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    const { data: articles, error, count } = await queryBuilder

    if (error) {
      throw error
    }

    // Transform articles
    const transformedArticles = (articles || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      imageUrl: article.image_url,
      content: article.content,
      category: Array.isArray(article.categories)
        ? article.categories[0]?.name || 'News'
        : article.categories?.name || 'News',
      author: Array.isArray(article.authors)
        ? article.authors[0]?.name || 'Unknown'
        : article.authors?.name || 'Unknown',
      authorProfileUrl: Array.isArray(article.authors)
        ? article.authors[0]?.profile_picture_url
        : article.authors?.profile_picture_url,
      publishedAt: article.published_at,
      readTime: Math.ceil((article.content?.split(' ').length || 0) / 200) || 5
    }))

    return NextResponse.json({
      articles: transformedArticles,
      total: count || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search articles', articles: [] },
      { status: 500 }
    )
  }
}
