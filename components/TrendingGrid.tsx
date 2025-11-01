'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { buildArticleUrl } from '@/lib/slug-utils'
import { FireIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid'

interface Article {
  id: string
  title: string
  excerpt: string
  image_url: string
  category: string
  author: string
  published_at: string
  slug?: string
  content?: string
  views?: number
}

const TrendingGrid = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingArticles()
  }, [])

  const fetchTrendingArticles = async () => {
    try {
      // Calculate date 24 hours ago
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)
      const oneDayAgoISO = oneDayAgo.toISOString()

      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          image_url,
          slug,
          published_at,
          content,
          views,
          categories!inner (name),
          authors!inner (name)
        `)
        .eq('status', 'published')
        .gte('published_at', oneDayAgoISO)
        .order('views', { ascending: false })
        .limit(3)

      if (error) {
        console.error('Error fetching trending articles:', error)
        return
      }

      if (data && data.length > 0) {
        const formattedArticles: Article[] = data.map((article: any) => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          image_url: article.image_url,
          slug: article.slug,
          category: (article.categories as any)?.name || 'News',
          author: (article.authors as any)?.name || 'Editor',
          published_at: article.published_at,
          content: article.content,
          views: article.views || 0
        }))
        setArticles(formattedArticles)
      }
    } catch (error) {
      console.error('Error fetching trending articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getArticleUrl = (article: Article) => {
    return article.slug 
      ? buildArticleUrl(article.category, article.slug)
      : `/article/${article.id}`
  }

  if (loading || articles.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 rounded-xl">
              <FireIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Trending Now</h2>
              <p className="text-gray-600 text-sm">Most read stories today</p>
            </div>
          </div>
          <ArrowTrendingUpIcon className="h-8 w-8 text-red-600" />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={getArticleUrl(article)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Rank Badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
              </div>

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                  {article.category}
                </span>
                <h3 className="font-serif text-xl font-bold leading-tight mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{article.author}</span>
                  <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrendingGrid
