'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { buildArticleUrl } from '@/lib/slug-utils'
import { StarIcon } from '@heroicons/react/24/solid'

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

const EditorsPicksSection = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEditorsPicks()
  }, [])

  const fetchEditorsPicks = async () => {
    try {
      console.log('Fetching editors picks...')
      
      // Try to fetch with is_editors_pick filter
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          image_url,
          slug,
          published_at,
          is_editors_pick,
          categories!inner (name),
          authors!inner (name)
        `)
        .eq('status', 'published')
        .eq('is_editors_pick', true)
        .order('published_at', { ascending: false })
        .limit(4)

      console.log('Query result:', { data, error })

      // If column doesn't exist or any error, show nothing
      if (error) {
        console.warn('Error fetching editors picks:', error.message)
        setArticles([])
        setLoading(false)
        return
      }

      // Only set articles if we have data
      if (data && data.length > 0) {
        console.log(`Found ${data.length} editor picks`)
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
        console.log('No editor picks found')
        setArticles([])
      }
    } catch (error) {
      console.error('Error fetching editors picks:', error)
      setArticles([])
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

  const mainArticle = articles[0]
  const sideArticles = articles.slice(1, 4)

  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
            <StarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Editor's Picks</h2>
            <p className="text-gray-600 text-sm">Handpicked stories you shouldn't miss</p>
          </div>
        </div>

        {/* Main + Side Articles Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured Article */}
          <div className="lg:col-span-2">
            <Link href={getArticleUrl(mainArticle)} className="group block">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6 shadow-xl">
                <Image
                  src={mainArticle.image_url}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    <StarIcon className="h-4 w-4" />
                    Editor's Pick
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                      {mainArticle.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl font-bold leading-tight mb-3 group-hover:text-purple-300 transition-colors">
                    {mainArticle.title}
                  </h3>
                  <p className="text-gray-100 line-clamp-2">
                    {mainArticle.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="space-y-4">
            {sideArticles.map((article, index) => (
              <Link
                key={article.id}
                href={getArticleUrl(article)}
                className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex gap-4 p-4">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{index + 2}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                      {article.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold leading-tight mt-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-2">
                      By {article.author}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Decorative Line */}
        <div className="mt-12 pt-8 border-t border-purple-200">
          <p className="text-center text-sm text-gray-600">
            ✨ Curated by our editorial team • Updated daily
          </p>
        </div>
      </div>
    </section>
  )
}

export default EditorsPicksSection
