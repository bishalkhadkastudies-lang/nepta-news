import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { normalizeCategory } from '@/lib/slug-utils'

/**
 * 301 Redirect from old UUID-based URLs to new SEO-friendly URLs
 * Old format: /article/[uuid]
 * New format: /[category]/[slug]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params
    const supabase = await createClient()

    // Fetch article by ID to get category and slug
    const { data, error } = await supabase
      .from('articles')
      .select(`
        slug,
        categories (name)
      `)
      .eq('id', articleId)
      .single()

    if (error || !data) {
      // Article not found - redirect to home
      return NextResponse.redirect(new URL('/', request.url), { status: 301 })
    }

    // Get category name
    const categoryName = Array.isArray(data.categories)
      ? data.categories[0]?.name
      : (data.categories as any)?.name

    const normalizedCategory = normalizeCategory(categoryName || 'news')
    const newUrl = `/${normalizedCategory}/${data.slug}`

    // 301 Permanent Redirect
    return NextResponse.redirect(new URL(newUrl, request.url), { status: 301 })
  } catch (error) {
    console.error('Redirect error:', error)
    // Fallback to home on error
    return NextResponse.redirect(new URL('/', request.url), { status: 301 })
  }
}
