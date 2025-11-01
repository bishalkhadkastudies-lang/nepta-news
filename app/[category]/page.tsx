import { createClient } from '@/lib/supabase-server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { normalizeCategory, buildArticleUrl } from '@/lib/slug-utils'

interface Article {
  id: string
  title: string
  excerpt: string
  image_url: string
  slug: string
  published_at: string
  read_time: number
  author_name: string
}

interface PageProps {
  params: Promise<{
    category: string
  }>
}

// Valid categories
const VALID_CATEGORIES = [
  'world',
  'politics',
  'business',
  'technology',
  'science',
  'health',
  'sports',
  'arts',
  'opinion',
  'lifestyle'
]

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  
  const normalizedCategory = normalizeCategory(category)
  
  // Check if category is valid
  if (!VALID_CATEGORIES.includes(normalizedCategory)) {
    notFound()
  }

  const supabase = await createClient()

  try {
    // Get category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', normalizedCategory)
      .single()

    if (categoryError || !categoryData) {
      console.error('Category not found:', normalizedCategory)
      notFound()
    }

    // Fetch articles for this category
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        excerpt,
        image_url,
        slug,
        published_at,
        content,
        authors (name)
      `)
      .eq('category_id', categoryData.id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (articlesError) {
      console.error('Error fetching articles:', articlesError)
      throw articlesError
    }

    const formattedArticles: Article[] = (articles || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      image_url: article.image_url,
      slug: article.slug,
      published_at: article.published_at,
      read_time: article.content ? Math.ceil(article.content.split(' ').length / 200) : 5,
      author_name: Array.isArray(article.authors)
        ? article.authors[0]?.name || 'Staff'
        : (article.authors as any)?.name || 'Staff'
    }))

    // Capitalize category name for display
    const displayCategoryName = categoryData.name.charAt(0).toUpperCase() + categoryData.name.slice(1)

    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Category Header */}
          <div className="border-b border-nytimes-border pb-6 mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
              {displayCategoryName}
            </h1>
            <p className="text-nytimes-gray text-lg">
              {formattedArticles.length} {formattedArticles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>

          {/* Articles Grid */}
          {formattedArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-nytimes-gray mb-4">
                No articles found in {displayCategoryName}
              </p>
              <Link
                href="/"
                className="text-nytimes-accent hover:underline font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {formattedArticles.map((article) => {
                const articleUrl = article.slug
                  ? buildArticleUrl(normalizedCategory, article.slug)
                  : `/article/${article.id}`

                return (
                  <Link
                    key={article.id}
                    href={articleUrl}
                    className="article-card group"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <h2 className="font-serif text-xl font-bold leading-tight mb-3 group-hover:text-nytimes-accent transition-colors">
                        {article.title}
                      </h2>

                      <p className="text-nytimes-gray mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-nytimes-gray">
                        <div>
                          <span className="font-medium">{article.author_name}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(article.published_at).toLocaleDateString()}</span>
                        </div>
                        <span>{article.read_time} min read</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Load More - Future Enhancement */}
          {formattedArticles.length >= 50 && (
            <div className="text-center mt-12">
              <p className="text-nytimes-gray">
                Showing {formattedArticles.length} articles
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Error loading category page:', error)
    notFound()
  }
}

// Generate static params for valid categories
export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({
    category: category
  }))
}
