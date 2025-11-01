'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase-client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BookmarkIcon, TrashIcon } from '@heroicons/react/24/outline'

interface SavedArticle {
  id: string
  title: string
  excerpt: string
  image_url: string
  category: string
  published_at: string
  saved_at: string
}

export default function SavedArticlesPage() {
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  const [articles, setArticles] = useState<SavedArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      fetchSavedArticles()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [authLoading, user])

  const fetchSavedArticles = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('saved_articles')
        .select(`
          id,
          saved_at,
          articles (
            id,
            title,
            excerpt,
            image_url,
            published_at,
            categories (name)
          )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false })

      if (fetchError) throw fetchError

      const transformedArticles = (data || []).map((item: any) => ({
        id: item.articles.id,
        title: item.articles.title,
        excerpt: item.articles.excerpt,
        image_url: item.articles.image_url,
        category: item.articles.categories?.name || 'News',
        published_at: item.articles.published_at,
        saved_at: item.saved_at
      }))

      setArticles(transformedArticles)
    } catch (err) {
      console.error('Error fetching saved articles:', err)
      setError('Failed to load saved articles')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (articleId: string) => {
    try {
      const response = await fetch('/api/bookmarks/unsave', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
      })

      if (response.ok) {
        setArticles(articles.filter(a => a.id !== articleId))
      }
    } catch (err) {
      console.error('Error removing article:', err)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <BookmarkIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In to View Saved Articles</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to access your saved articles and reading list.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block bg-nytimes-accent text-white px-6 py-3 rounded-lg hover:bg-nytimes-accent/90 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Saved Articles</h1>
          <p className="text-gray-600">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'} saved
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="w-32 h-24 bg-gray-200 rounded flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <BookmarkIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Saved Articles Yet</h2>
            <p className="text-gray-600 mb-6">
              Start saving articles to build your reading list.
            </p>
            <Link
              href="/"
              className="inline-block bg-nytimes-accent text-white px-6 py-3 rounded-lg hover:bg-nytimes-accent/90 transition-colors"
            >
              Browse Articles
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="flex gap-4 pb-6 border-b border-gray-200 hover:bg-gray-50 transition-colors p-4 rounded-lg"
              >
                {/* Image */}
                <div className="w-32 h-24 flex-shrink-0 relative rounded-lg overflow-hidden">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${article.category.toLowerCase()}`}
                    className="text-xs font-semibold uppercase tracking-wide text-nytimes-accent hover:underline"
                  >
                    {article.category}
                  </Link>
                  <Link
                    href={`/article/${article.id}`}
                    className="block text-lg font-bold text-gray-900 hover:text-nytimes-accent transition-colors mb-2 line-clamp-2"
                  >
                    {article.title}
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(article.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>
                      Saved {new Date(article.saved_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(article.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove from saved"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
