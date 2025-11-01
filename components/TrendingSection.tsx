'use client'

import Link from 'next/link'
import { FireIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { buildArticleUrl } from '@/lib/slug-utils'

interface TrendingArticle {
  id: string
  title: string
  slug?: string
  category: string
  readTime: number
  rank: number
}

const TrendingSection = () => {
  const [articles, setArticles] = useState<TrendingArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingArticles()
  }, [])

  const fetchTrendingArticles = async () => {
    try {
      const response = await fetch('/api/articles/trending', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error fetching trending articles:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-nytimes-light-gray py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <FireIcon className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-serif font-bold">Most Popular</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (articles.length === 0) {
    return null
  }

  return (
    <section className="py-8 mb-8 border-t border-nytimes-border">
      <div className="flex items-center mb-6 pb-4 border-b-2 border-black">
        <FireIcon className="h-6 w-6 text-red-500 mr-2" />
        <h2 className="text-2xl font-serif font-bold">Most Popular</h2>
      </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {articles.map((article) => {
            // Use new URL if slug exists, fallback to old URL format
            const articleUrl = article.slug 
              ? buildArticleUrl(article.category, article.slug)
              : `/article/${article.id}`
            
            return (
            <Link
              key={article.id}
              href={articleUrl}
              className="group"
            >
              <div className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow h-full">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-3xl font-bold text-nytimes-accent">
                      {article.rank}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-nytimes-gray line-clamp-1">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-serif text-sm md:text-base font-bold leading-tight mb-2 group-hover:text-nytimes-accent transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                    <div className="text-xs text-nytimes-gray">
                      {article.readTime} min read
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            )
          })}
        </div>
    </section>
  )
}

export default TrendingSection
