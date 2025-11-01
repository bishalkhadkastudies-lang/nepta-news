'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { buildArticleUrl } from '@/lib/slug-utils'
import { BoltIcon } from '@heroicons/react/24/solid'

interface Article {
  id: string
  title: string
  category: string
  slug?: string
}

const BreakingNews = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchBreakingNews()
  }, [])

  useEffect(() => {
    if (articles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [articles.length])

  const fetchBreakingNews = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          slug,
          categories!inner (name)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error fetching breaking news:', error)
        return
      }

      if (data && data.length > 0) {
        const formattedArticles: Article[] = data.map((article: any) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          category: (article.categories as any)?.name || 'News'
        }))
        setArticles(formattedArticles)
      }
    } catch (error) {
      console.error('Error fetching breaking news:', error)
    }
  }

  if (articles.length === 0) {
    return null
  }

  const currentArticle = articles[currentIndex]
  const articleUrl = currentArticle.slug 
    ? buildArticleUrl(currentArticle.category, currentArticle.slug)
    : `/article/${currentArticle.id}`

  return (
    <div className="bg-red-600 text-white py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <BoltIcon className="h-5 w-5 animate-pulse" />
            <span className="font-bold text-sm uppercase tracking-wider">Breaking</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Link
              href={articleUrl}
              className="block hover:underline transition-all"
            >
              <p className="text-sm md:text-base font-medium truncate">
                {currentArticle.title}
              </p>
            </Link>
          </div>
          {articles.length > 1 && (
            <div className="flex gap-1 flex-shrink-0">
              {articles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`Go to news ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BreakingNews
