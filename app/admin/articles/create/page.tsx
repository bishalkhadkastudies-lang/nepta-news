'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createUniqueSlug } from '@/lib/slug-utils'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
}

interface Author {
  id: string
  name: string
}

export default function CreateArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [profileUploading, setProfileUploading] = useState(false)
  const [profileUploadSuccess, setProfileUploadSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category_id: '',
    author_id: '',
    status: 'draft' as 'draft' | 'published',
    tags: '',
    custom_author_name: '',
    custom_author_profile_url: ''
  })

  useEffect(() => {
    // Load form data from localStorage on mount
    const savedFormData = localStorage.getItem('articleFormData')
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData))
      } catch (err) {
        console.error('Error loading form data:', err)
      }
    }
    fetchData()
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('articleFormData', JSON.stringify(formData))
  }, [formData])

  const fetchData = async () => {
    try {
      const [categoriesRes, authorsRes] = await Promise.all([
        supabase.from('categories').select('id, name'),
        supabase.from('authors').select('id, name')
      ])

      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (authorsRes.data) setAuthors(authorsRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setUploadProgress(0)
      setUploadSuccess(false)

      // Generate unique filename
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const fileExt = file.name.split('.').pop()
      const fileName = `${timestamp}-${random}.${fileExt}`

      // Determine bucket based on file type
      const bucket = file.type.startsWith('video/') ? 'videos' : 'images'

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      setUploadProgress(50)

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData.publicUrl
      setUploadProgress(100)

      // Auto-populate image URL in form
      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }))

      setUploadFile(null)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setProfileUploading(true)
      setProfileUploadSuccess(false)

      // Generate unique filename
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const fileExt = file.name.split('.').pop()
      const fileName = `${timestamp}-${random}.${fileExt}`

      // Upload to Supabase Storage (using images bucket for profiles)
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`profiles/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(`profiles/${fileName}`)

      const publicUrl = publicUrlData.publicUrl

      // Auto-populate profile URL in form
      setFormData(prev => ({
        ...prev,
        custom_author_profile_url: publicUrl
      }))

      setProfileUploadSuccess(true)
      setTimeout(() => setProfileUploadSuccess(false), 3000)
    } catch (err: any) {
      console.error('Profile upload error:', err)
      setError(err?.message || 'Failed to upload profile picture')
    } finally {
      setProfileUploading(false)
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
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category_id) {
      setError('Please fill in all required fields (title, excerpt, content, category)')
      return
    }

    // Check if author is selected or custom author name is provided
    if (!formData.author_id && !formData.custom_author_name) {
      setError('Please select an author or enter a custom author name')
      return
    }

    try {
      setLoading(true)
      setError(null)

      let authorId = formData.author_id

      // If custom author is provided, create new author
      if (formData.custom_author_name && !formData.author_id) {
        const { data: newAuthor, error: authorError } = await supabase
          .from('authors')
          .insert([{
            name: formData.custom_author_name.trim(),
            profile_picture_url: formData.custom_author_profile_url.trim() || null
          }])
          .select()
          .single()

        if (authorError) throw authorError
        authorId = newAuthor.id
      }

      // Generate unique slug
      const { data: existingSlugs } = await supabase
        .from('articles')
        .select('slug')
        .eq('category_id', formData.category_id)

      const existingSlugList = (existingSlugs || []).map((article: any) => article.slug)
      const slug = createUniqueSlug(formData.title.trim(), existingSlugList)

      const articleData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        image_url: formData.image_url.trim() || null,
        category_id: formData.category_id,
        author_id: authorId,
        slug: slug,
        status: formData.status,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      }

      const { data, error: err } = await supabase
        .from('articles')
        .insert([articleData])
        .select()

      if (err) throw err

      setSuccess(true)
      // Clear saved form data after successful creation
      localStorage.removeItem('articleFormData')
      setTimeout(() => {
        router.push('/admin/articles')
      }, 1500)
    } catch (err: any) {
      console.error('Error:', err)
      const errorMessage = err?.message || err?.error?.message || 'Failed to create article'
      setError(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
          Article created successfully! Redirecting...
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
            placeholder="Enter article title"
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
            placeholder="Enter article excerpt (summary)"
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
            placeholder="Enter full article content (HTML supported)"
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent font-mono text-sm"
            required
          />
        </div>

        {/* Image Upload and URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>

          {/* Upload Success Message */}
          {uploadSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-sm">
              ✅ Image uploaded successfully!
            </div>
          )}

          {/* File Upload Input */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Upload Image File
            </label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
              />
              {uploading && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-nytimes-accent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">{uploadProgress}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Image URL Input */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Or paste image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
            />
          </div>

          {/* Image Preview */}
          {formData.image_url && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
              <img
                src={formData.image_url}
                alt="Preview"
                className="max-w-xs h-32 object-cover rounded border border-gray-300"
              />
            </div>
          )}
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
            >
              <option value="">Select an existing author</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Or create a new author below</p>
          </div>
        </div>

        {/* Custom Author Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Author (Optional)</h3>
          <p className="text-sm text-gray-600 mb-4">If you want to create a new author, fill in the details below. Otherwise, select an existing author above.</p>
          
          {/* Author Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name
            </label>
            <input
              type="text"
              name="custom_author_name"
              value={formData.custom_author_name}
              onChange={handleChange}
              placeholder="e.g., Sarah Johnson"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
            />
          </div>

          {/* Author Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Profile Picture (Optional)
            </label>

            {profileUploadSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-sm">
                ✅ Profile picture uploaded successfully!
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                disabled={profileUploading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent"
              />
              {profileUploading && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-nytimes-accent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Uploading...</span>
                </div>
              )}
            </div>

            {/* Profile Picture Preview */}
            {formData.custom_author_profile_url && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                <img
                  src={formData.custom_author_profile_url}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full border border-gray-300"
                />
              </div>
            )}
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
            value={formData.tags}
            onChange={handleChange}
            placeholder="news, breaking, politics"
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
              <span className="text-gray-700">Publish Now</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-nytimes-accent text-white rounded-lg hover:bg-nytimes-accent/90 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Creating...' : 'Create Article'}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                excerpt: '',
                content: '',
                image_url: '',
                category_id: '',
                author_id: '',
                status: 'draft',
                tags: '',
                custom_author_name: '',
                custom_author_profile_url: ''
              })
              localStorage.removeItem('articleFormData')
            }}
            className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Clear Form
          </button>
          <Link
            href="/admin/articles"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
