import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createUniqueSlug } from '@/lib/slug-utils'

/**
 * API endpoint to generate a unique slug for an article
 * POST /api/articles/generate-slug
 * Body: { title: string, categoryId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { title, categoryId } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get existing slugs for this category (if categoryId provided)
    let existingSlugs: string[] = []
    if (categoryId) {
      const { data } = await supabase
        .from('articles')
        .select('slug')
        .eq('category_id', categoryId)

      existingSlugs = (data || []).map((article: any) => article.slug)
    }

    // Generate unique slug
    const slug = createUniqueSlug(title, existingSlugs)

    return NextResponse.json({ slug }, { status: 200 })
  } catch (error) {
    console.error('Error generating slug:', error)
    return NextResponse.json(
      { error: 'Failed to generate slug' },
      { status: 500 }
    )
  }
}
