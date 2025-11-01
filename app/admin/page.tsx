'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { DocumentTextIcon, EyeIcon, HeartIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Article {
  id: string
  title: string
  excerpt: string
  status: 'published' | 'draft'
  published_at: string
  categories?: any
  authors?: any
}

interface Stats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalViews: number
}

const AdminDashboard = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          status,
          published_at,
          categories (name),
          authors (name)
        `)
        .order('published_at', { ascending: false })
        .limit(20)

      if (articlesError) throw articlesError

      setArticles(articlesData || [])

      // Calculate stats
      const total = articlesData?.length || 0
      const published = articlesData?.filter(a => a.status === 'published').length || 0
      const draft = articlesData?.filter(a => a.status === 'draft').length || 0

      setStats({
        totalArticles: total,
        publishedArticles: published,
        draftArticles: draft,
        totalViews: published * 100 // Mock calculation
      })
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      setArticles(articles.filter(a => a.id !== id))
    } catch (err) {
      console.error('Error deleting article:', err)
      alert('Failed to delete article')
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'published' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 md:p-8 h-full">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-300 rounded w-48"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 md:h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 p-4 md:p-8 h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
          </div>
          <Link
            href="/admin/articles/create"
            className="flex items-center space-x-2 bg-nytimes-accent text-white px-6 py-3 rounded-lg hover:bg-nytimes-accent/90 transition-colors whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Article</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Total Articles</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats.totalArticles}</p>
              </div>
              <DocumentTextIcon className="h-8 md:h-12 w-8 md:w-12 text-nytimes-accent opacity-20 ml-2 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Published</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600 mt-1">{stats.publishedArticles}</p>
              </div>
              <EyeIcon className="h-8 md:h-12 w-8 md:w-12 text-green-600 opacity-20 ml-2 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Drafts</p>
                <p className="text-2xl md:text-3xl font-bold text-yellow-600 mt-1">{stats.draftArticles}</p>
              </div>
              <PencilIcon className="h-8 md:h-12 w-8 md:w-12 text-yellow-600 opacity-20 ml-2 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Total Views</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-1">{stats.totalViews.toLocaleString()}</p>
              </div>
              <HeartIcon className="h-8 md:h-12 w-8 md:w-12 text-blue-600 opacity-20 ml-2 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Articles</h2>
          </div>

          {articles.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <DocumentTextIcon className="h-12 md:h-16 w-12 md:w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No articles yet</p>
              <Link
                href="/admin/articles/create"
                className="text-nytimes-accent hover:underline font-medium"
              >
                Create your first article
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                    <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Author</th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <p className="font-medium text-gray-900 max-w-xs truncate text-xs md:text-sm">{article.title}</p>
                      </td>
                      <td className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                        {article.categories?.name || 'N/A'}
                      </td>
                      <td className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                        {article.authors?.name || 'N/A'}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                        {new Date(article.published_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex space-x-2 md:space-x-3">
                          <Link
                            href={`/article/${article.id}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            target="_blank"
                            title="View"
                          >
                            <EyeIcon className="h-4 md:h-5 w-4 md:w-5" />
                          </Link>
                          <Link
                            href={`/admin/articles/edit/${article.id}`}
                            className="text-nytimes-accent hover:text-nytimes-accent/80 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 md:h-5 w-4 md:w-5" />
                          </Link>
                          <button
                            onClick={() => deleteArticle(article.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 md:h-5 w-4 md:w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
