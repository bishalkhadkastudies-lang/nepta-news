'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
}

interface Author {
  id: string
  name: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image_url: string
  category_id: string
  author_id: string
  status: 'draft' | 'published'
  tags: string[]
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<Article>({
    id: '',
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category_id: '',
    author_id: '',
    status: 'draft',
    tags: []
  })

  useEffect(() => {
    fetchData()
  }, [articleId])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [articleRes, categoriesRes, authorsRes] = await Promise.all([
        supabase.from('articles').select('*').eq('id', articleId).single(),
        supabase.from('categories').select('id, name'),
        supabase.from('authors').select('id, name')
      ])

      if (articleRes.error) throw articleRes.error
      if (!articleRes.data) throw new Error('Article not found')

      setFormData(articleRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (authorsRes.data) setAuthors(authorsRes.data)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.excerpt || !formData.content || !formData.category_id || !formData.author_id) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const { error: err } = await supabase
        .from('articles')
        .update({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          image_url: formData.image_url,
          category_id: formData.category_id,
          author_id: formData.author_id,
          status: formData.status,
          tags: formData.tags,
          published_at: formData.status === 'published' ? new Date().toISOString() : null
        })
        .eq('id', articleId)

      if (err) throw err

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/articles')
      }, 1500)
    } catch (err: any) {
      console.error('Error:', err)
      const errorMessage = err?.message || err?.error?.message || 'Failed to update article'
      setError(`Error: ${errorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-nytimes-accent hover:text-nytimes-accent/80 mr-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
          Article updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-4xl">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
            required
          />
        </div>

        {/* Excerpt */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
            required
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent font-mono text-sm"
            required
          />
        </div>

        {/* Image URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image URL
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
          />
        </div>

        {/* Category and Author */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <select
              name="author_id"
              value={formData.author_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
              required
            >
              <option value="">Select an author</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              tags: e.target.value.split(',').map(t => t.trim())
            }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
          />
        </div>

        {/* Status */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">Draft</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">Published</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-nytimes-accent text-white rounded-lg hover:bg-nytimes-accent/90 disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
