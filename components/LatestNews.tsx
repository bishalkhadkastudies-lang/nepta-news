'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { normalizeCategory, buildArticleUrl } from '@/lib/slug-utils'

interface Article {
  id: string
  title: string
  excerpt: string
  image_url: string
  category: string
  author: string
  published_at: string
  readTime: number
  slug: string
}

const LatestNews = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [visibleCount, setVisibleCount] = useState(6)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            excerpt,
            image_url,
            slug,
            published_at,
            categories!inner (name),
            authors!inner (name)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(12)

        if (error) {
          console.error('Error fetching latest articles:', error)
          return
        }

        if (data && data.length > 0) {
          const formattedArticles: Article[] = data.map((article: any) => {
            const categoryName = (article.categories as any)?.name || 'News'
            const slug = article.slug
            
            // Debug logging
            if (!slug) {
              console.warn('Article missing slug:', article.title, article.id)
            }
            
            return {
              id: article.id,
              title: article.title,
              excerpt: article.excerpt,
              image_url: article.image_url,
              slug: slug,
              category: categoryName,
              author: (article.authors as any)?.name || 'Editor',
              published_at: article.published_at,
              readTime: Math.ceil(article.excerpt?.length / 200) || 3
            }
          })
          setArticles(formattedArticles)
        } else {
          // No articles - empty state
          setArticles([])
        }
      } catch (error) {
        console.error('Error fetching latest articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestArticles()
  }, [])

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, articles.length))
  }

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-8 w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-gray-300 rounded-lg"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-6 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              No Articles Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your news platform is ready! Start creating and publishing your first articles to see them appear here.
            </p>
            <a
              href="/admin"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-nytimes-accent hover:bg-nytimes-accent/90 transition-colors"
            >
              Go to Admin Dashboard
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 mb-8 border-t border-nytimes-border">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
        <h2 className="text-2xl font-serif font-bold">Latest News</h2>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, visibleCount).map((article) => {
            // Use new URL if slug exists, fallback to old URL format
            const articleUrl = article.slug 
              ? buildArticleUrl(article.category, article.slug)
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
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-nytimes-accent">
                    {article.category}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold leading-tight mb-3 group-hover:text-nytimes-accent transition-colors">
                  {article.title}
                </h3>

                <p className="text-nytimes-gray mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-nytimes-gray">
                  <div>
                    <span className="font-medium">{article.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </Link>
            )
          })}
        </div>

      {visibleCount < articles.length && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            className="btn-primary text-lg px-8 py-3"
          >
            Load More Articles
          </button>
        </div>
      )}
    </section>
  )
}

export default LatestNews
