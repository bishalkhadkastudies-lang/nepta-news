'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { buildArticleUrl } from '@/lib/slug-utils'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  published_at: string
  slug?: string
}

const OpinionSection = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOpinionArticles()
  }, [])

  const fetchOpinionArticles = async () => {
    try {
      // Get opinion category ID first
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', 'opinion')
        .single()

      if (!categoryData) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          slug,
          published_at,
          categories!inner (name),
          authors!inner (name)
        `)
        .eq('category_id', categoryData.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(4)

      if (error) {
        console.error('Error fetching opinion articles:', error)
        return
      }

      if (data && data.length > 0) {
        const formattedArticles: Article[] = data.map((article: any) => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          slug: article.slug,
          category: (article.categories as any)?.name || 'Opinion',
          author: (article.authors as any)?.name || 'Editor',
          published_at: article.published_at
        }))
        setArticles(formattedArticles)
      }
    } catch (error) {
      console.error('Error fetching opinion articles:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || articles.length === 0) {
    return null
  }

  const getArticleUrl = (article: Article) => {
    return article.slug 
      ? buildArticleUrl(article.category, article.slug)
      : `/article/${article.id}`
  }

  return (
    <section className="bg-nytimes-light-gray py-8 mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center mb-6 pb-4 border-b-2 border-nytimes-accent">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-nytimes-accent mr-2" />
          <h2 className="text-2xl font-serif font-bold">Opinion</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={getArticleUrl(article)}
              className="group bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-serif text-lg font-bold leading-tight mb-3 group-hover:text-nytimes-accent transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-nytimes-gray mb-3 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="text-xs text-nytimes-gray">
                <span className="font-medium">{article.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(article.published_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/opinion"
            className="text-nytimes-accent hover:underline font-medium text-sm"
          >
            View All Opinion Articles →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default OpinionSection
