'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { buildArticleUrl } from '@/lib/slug-utils'

interface Article {
  id: string
  title: string
  excerpt: string
  image_url: string
  category: string
  author: string
  published_at: string
  slug?: string
}

const FeaturedStories = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedArticles()
  }, [])

  const fetchFeaturedArticles = async () => {
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
        .limit(5)

      if (error) {
        console.error('Error fetching featured articles:', error)
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
          published_at: article.published_at
        }))
        setArticles(formattedArticles)
      }
    } catch (error) {
      console.error('Error fetching featured articles:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || articles.length === 0) {
    return null
  }

  const mainArticle = articles[0]
  const sideArticles = articles.slice(1, 5)

  const getArticleUrl = (article: Article) => {
    return article.slug 
      ? buildArticleUrl(article.category, article.slug)
      : `/article/${article.id}`
  }

  return (
    <section className="border-b border-nytimes-border pb-8 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Featured Article - Large */}
        <div className="lg:col-span-7">
          <Link href={getArticleUrl(mainArticle)} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden mb-4">
              <Image
                src={mainArticle.image_url}
                alt={mainArticle.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-nytimes-accent">
                {mainArticle.category}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-3 group-hover:text-nytimes-accent transition-colors">
              {mainArticle.title}
            </h2>
            <p className="text-lg text-nytimes-gray leading-relaxed mb-3">
              {mainArticle.excerpt}
            </p>
            <div className="text-sm text-nytimes-gray">
              By {mainArticle.author} • {new Date(mainArticle.published_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </Link>
        </div>

        {/* Side Articles - Smaller */}
        <div className="lg:col-span-5 space-y-6">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              href={getArticleUrl(article)}
              className="group block pb-6 border-b border-nytimes-border last:border-b-0"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32 h-24 relative">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-nytimes-accent">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold leading-tight mb-2 group-hover:text-nytimes-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="text-xs text-nytimes-gray">
                    {new Date(article.published_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedStories
