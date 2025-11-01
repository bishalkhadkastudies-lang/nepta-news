'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
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

const HeroSection = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
            categories!inner (name),
            authors!inner (name)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(5)

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
            published_at: article.published_at
          }))
          setArticles(formattedArticles)
        } else {
          // No articles - empty state
          setArticles([])
        }
      } catch (error) {
        console.error('Error fetching hero articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroArticles()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || articles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, articles.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length)
    setIsAutoPlaying(false)
  }

  if (loading) {
    return (
      <section className="relative bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="relative bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Welcome to Your News Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your professional news website is ready for content. Start creating and publishing your first articles to see them appear here.
            </p>
            <a
              href="/admin"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-nytimes-accent hover:bg-nytimes-accent/90 transition-colors"
            >
              Go to Admin Dashboard
            </a>
          </div>
        </div>
      </section>
    )
  }

  const currentArticle = articles[currentSlide]
  const currentArticleUrl = currentArticle.slug 
    ? buildArticleUrl(currentArticle.category, currentArticle.slug)
    : `/article/${currentArticle.id}`

  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Hero Article */}
          <div className="lg:col-span-2">
            <div className="relative group cursor-pointer" onClick={() => window.location.href = currentArticleUrl}>
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={currentArticle.image_url}
                  alt={currentArticle.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide bg-nytimes-accent px-2 py-1 rounded">
                    {currentArticle.category}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-3 leading-tight">
                  {currentArticle.title}
                </h1>
                <p className="text-lg mb-3 text-gray-200 line-clamp-2">
                  {currentArticle.excerpt}
                </p>
                <div className="text-sm text-gray-300">
                  By {currentArticle.author} • {new Date(currentArticle.published_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white border border-nytimes-border hover:bg-nytimes-light-gray transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="flex space-x-2">
                {articles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-nytimes-accent' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white border border-nytimes-border hover:bg-nytimes-light-gray transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Side Stories */}
          <div className="space-y-6">
            <h2 className="section-header">Top Stories</h2>
            {articles.slice(1, 4).map((article, index) => {
              const articleUrl = article.slug 
                ? buildArticleUrl(article.category, article.slug)
                : `/article/${article.id}`
              
              return (
              <Link
                key={article.id}
                href={articleUrl}
                className="block group hover:bg-nytimes-light-gray p-4 -mx-4 rounded-lg transition-colors"
              >
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-20 h-20 relative">
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-nytimes-accent">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold leading-tight mb-2 group-hover:text-nytimes-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-nytimes-gray line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
