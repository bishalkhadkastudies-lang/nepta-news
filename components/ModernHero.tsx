'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { buildArticleUrl } from '@/lib/slug-utils'
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline'

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
}

const ModernHero = () => {
  const [mainArticle, setMainArticle] = useState<Article | null>(null)
  const [sideArticles, setSideArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHeroArticles()
  }, [])

  const fetchHeroArticles = async () => {
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
          content,
          categories!inner (name),
          authors!inner (name)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(4)

      if (error) {
        console.error('Error fetching hero articles:', error)
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
          content: article.content
        }))
        
        setMainArticle(formattedArticles[0])
        setSideArticles(formattedArticles.slice(1))
      }
    } catch (error) {
      console.error('Error fetching hero articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getArticleUrl = (article: Article) => {
    return article.slug 
      ? buildArticleUrl(article.category, article.slug)
      : `/article/${article.id}`
  }

  const getReadTime = (content?: string) => {
    if (!content) return 5
    return Math.ceil(content.split(' ').length / 200)
  }

  if (loading || !mainArticle) {
    return (
      <div className="h-[600px] bg-gray-100 animate-pulse"></div>
    )
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Hero Article */}
          <div className="lg:col-span-2">
            <Link href={getArticleUrl(mainArticle)} className="group block">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6 shadow-2xl">
                <Image
                  src={mainArticle.image_url}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="inline-block px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    {mainArticle.category}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4 group-hover:text-red-400 transition-colors">
                    {mainArticle.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-4 line-clamp-2">
                    {mainArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{mainArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>{getReadTime(mainArticle.content)} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="space-y-6">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={getArticleUrl(article)}
                className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0 w-28 h-28 relative rounded-lg overflow-hidden">
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-red-600 text-xs font-bold uppercase tracking-wider rounded mb-2">
                      {article.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon className="h-3 w-3" />
                      <span>{getReadTime(article.content)} min</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ModernHero
