'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MagnifyingGlassIcon, ArrowLeftIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

interface Article {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  publishedAt: string
  author: string
  category: string
  readTime: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState(query)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchCategories()
    if (query) {
      searchArticles(query)
    } else {
      setLoading(false)
    }
  }, [query, sortBy, category])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/articles/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const searchArticles = async (searchQuery: string) => {
    try {
      setLoading(true)
      setError(null)

      if (!searchQuery.trim()) {
        setArticles([])
        setLoading(false)
        return
      }

      const params = new URLSearchParams()
      params.set('q', searchQuery)
      params.set('sort', sortBy)
      if (category) params.set('category', category)

      const response = await fetch(`/api/articles/search?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setArticles(data.articles || [])
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search articles')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      const params = new URLSearchParams()
      params.set('q', searchInput)
      window.location.href = `/search?${params.toString()}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <Link
            href="/"
            className="flex items-center text-nytimes-accent hover:text-nytimes-accent/80 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute right-3 top-3 h-6 w-6 text-gray-400" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-nytimes-accent text-white rounded-lg hover:bg-nytimes-accent/90 transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Results Info */}
          {query && (
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Search Results
                </h1>
                <p className="text-gray-600">
                  {articles.length} {articles.length === 1 ? 'result' : 'results'} for "<strong>{query}</strong>"
                </p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>
          )}

          {/* Filters */}
          {showFilters && query && (
            <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
                  >
                    <option value="date">Newest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="animate-pulse space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              {query ? `No articles found for "${query}"` : 'Enter a search term to find articles'}
            </p>
            <Link
              href="/"
              className="text-nytimes-accent hover:underline font-medium"
            >
              Browse all articles
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group flex gap-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-48 h-32 bg-gray-200 flex-shrink-0 overflow-hidden">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-nytimes-accent uppercase">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {article.readTime} min read
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-nytimes-accent transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                    <span className="text-xs text-gray-500">
                      By {article.author}
                    </span>
                    <span className="text-nytimes-accent font-medium text-sm group-hover:translate-x-1 transition-transform">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
