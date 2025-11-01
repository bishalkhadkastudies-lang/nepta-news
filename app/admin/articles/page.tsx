'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'

interface Article {
  id: string
  title: string
  excerpt: string
  status: 'published' | 'draft'
  published_at: string
  slug?: string
  is_editors_pick?: boolean
  categories?: any
  authors?: any
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)

      // First try with is_editors_pick
      let { data, error: err } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          status,
          published_at,
          slug,
          is_editors_pick,
          categories (name),
          authors (name)
        `)
        .order('published_at', { ascending: false })

      // If column doesn't exist, fetch without it
      if (err && err.message.includes('is_editors_pick')) {
        console.warn('is_editors_pick column not found, fetching without it')
        const { data: fallbackData, error: fallbackErr } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            excerpt,
            status,
            published_at,
            slug,
            categories (name),
            authors (name)
          `)
          .order('published_at', { ascending: false })
        
        if (fallbackErr) throw fallbackErr
        data = fallbackData?.map(d => ({ ...d, is_editors_pick: false })) || []
      } else if (err) {
        throw err
      }

      setArticles(data || [])
    } catch (err) {
      console.error('Error fetching articles:', err)
      setError('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Delete this article?')) return

    try {
      const { error: err } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (err) throw err
      setArticles(articles.filter(a => a.id !== id))
    } catch (err) {
      alert('Failed to delete article')
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'published' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  const toggleEditorsPick = async (id: string, currentValue: boolean) => {
    try {
      const newValue = !currentValue
      console.log(`Toggling article ${id} from ${currentValue} to ${newValue}`)
      
      const { error: err } = await supabase
        .from('articles')
        .update({ is_editors_pick: newValue })
        .eq('id', id)

      if (err) {
        console.error('Update error:', err)
        alert(`Failed to update article: ${err.message}`)
        return
      }
      
      console.log('Update successful, updating UI')
      setArticles(articles.map(a => 
        a.id === id ? { ...a, is_editors_pick: newValue } : a
      ))
    } catch (err) {
      console.error('Toggle error:', err)
      alert('Failed to update article')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-1">Manage all your news articles</p>
        </div>
        <Link
          href="/admin/articles/create"
          className="flex items-center space-x-2 bg-nytimes-accent text-white px-6 py-3 rounded-lg hover:bg-nytimes-accent/90 transition-colors"
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

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded"></div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No articles yet</p>
          <Link
            href="/admin/articles/create"
            className="text-nytimes-accent hover:underline font-medium"
          >
            Create your first article
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Published</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Editor's Pick</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 max-w-xs truncate">{article.title}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.categories?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.authors?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(article.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleEditorsPick(article.id, article.is_editors_pick || false)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        article.is_editors_pick
                          ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {article.is_editors_pick ? '⭐ Pick' : 'Not Pick'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <Link
                        href={article.slug ? `/${(article.categories as any)?.name?.toLowerCase() || 'news'}/${article.slug}` : `/article/${article.id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        target="_blank"
                        title="View Article"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/admin/articles/edit/${article.id}`}
                        className="text-nytimes-accent hover:text-nytimes-accent/80 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
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
  )
}
