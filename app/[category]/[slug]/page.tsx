import { createClient } from '@/lib/supabase-server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleContent from '@/components/ArticleContent'
import CommentsSection from '@/components/CommentsSection'
import { normalizeCategory } from '@/lib/slug-utils'
import { notFound } from 'next/navigation'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image_url: string
  category: string
  author: string
  published_at: string
  read_time: number
  tags: string[]
  views: number
  slug: string
}

interface PageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = await params
  
  if (!category || !slug) {
    notFound()
  }

  const supabase = await createClient()

  try {
    // First, try to fetch article by slug without joins to debug
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (articleError || !articleData) {
      console.error('Article fetch error:', articleError)
      console.error('Article slug searched:', slug)
      notFound()
    }

    // Check if article is published
    if (articleData.status !== 'published') {
      console.error('Article not published, status:', articleData.status)
      notFound()
    }

    // Now fetch category and author separately
    let categoryName = 'News'
    let authorName = 'Staff'

    if (articleData.category_id) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('name')
        .eq('id', articleData.category_id)
        .single()

      if (categoryData?.name) {
        categoryName = categoryData.name
      }
    }

    if (articleData.author_id) {
      const { data: authorData } = await supabase
        .from('authors')
        .select('name')
        .eq('id', articleData.author_id)
        .single()

      if (authorData?.name) {
        authorName = authorData.name
      }
    }

    // Verify category matches (case-insensitive)
    const normalizedUrlCategory = normalizeCategory(category)
    const normalizedArticleCategory = normalizeCategory(categoryName)
    
    if (normalizedUrlCategory !== normalizedArticleCategory) {
      console.error('Category mismatch:', normalizedUrlCategory, 'vs', normalizedArticleCategory)
      notFound()
    }

    // Increment view count
    try {
      await supabase
        .from('articles')
        .update({ views: (articleData.views || 0) + 1 })
        .eq('id', articleData.id)
    } catch (viewErr) {
      console.error('Error updating views:', viewErr)
    }

    // Build article object
    const article: Article = {
      id: articleData.id,
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      image_url: articleData.image_url,
      category: categoryName,
      author: authorName,
      published_at: articleData.published_at,
      read_time: articleData.read_time,
      tags: articleData.tags || [],
      views: (articleData.views || 0) + 1,
      slug: articleData.slug
    }

    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <ArticleContent article={article} />
          <CommentsSection articleId={article.id} />
        </main>
        <Footer />
      </div>
    )
  } catch (err) {
    console.error('Error loading article:', err)
    notFound()
  }
}
