'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeftIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'

export default function UploadMediaPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Allowed: JPG, PNG, GIF, WebP, MP4, WebM')
      return
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File too large. Maximum size: 50MB')
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    try {
      setUploading(true)
      setError(null)
      setProgress(0)

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

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData.publicUrl

      setUploadedUrl(publicUrl)
      setSuccess(true)
      setProgress(100)

      // Copy to clipboard
      navigator.clipboard.writeText(publicUrl)

      // Auto-populate image URL in create article form
      const savedFormData = localStorage.getItem('articleFormData')
      if (savedFormData) {
        try {
          const formData = JSON.parse(savedFormData)
          formData.image_url = publicUrl
          localStorage.setItem('articleFormData', JSON.stringify(formData))
        } catch (err) {
          console.error('Error updating form data:', err)
        }
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err?.message || 'Failed to upload file')
    } finally {
      setUploading(false)
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
        <h1 className="text-3xl font-bold text-gray-900">Upload Media</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && uploadedUrl && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-medium mb-2">✅ Upload successful!</p>
            <p className="text-sm mb-2">✅ Image URL automatically added to article form!</p>
            <p className="text-sm mb-3">URL also copied to clipboard:</p>
            <div className="bg-white p-3 rounded border border-green-300 break-all font-mono text-xs">
              {uploadedUrl}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setFile(null)
                  setSuccess(false)
                  setUploadedUrl(null)
                  setProgress(0)
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Upload Another File
              </button>
              <Link
                href="/admin/articles/create"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block text-center"
              >
                Back to Article Form
              </Link>
            </div>
          </div>
        )}

        {!success && (
          <>
            {/* File Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Image or Video
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-nytimes-accent transition-colors">
                <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                  id="file-input"
                  disabled={uploading}
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer text-nytimes-accent hover:text-nytimes-accent/80 font-medium"
                >
                  Click to select file
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  or drag and drop
                </p>
              </div>

              {file && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">Selected:</p>
                  <p className="text-sm text-gray-600">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-2">📋 Supported Formats:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Images:</strong> JPG, PNG, GIF, WebP</li>
                <li>• <strong>Videos:</strong> MP4, WebM</li>
                <li>• <strong>Max Size:</strong> 50MB per file</li>
              </ul>
            </div>

            {/* Progress Bar */}
            {uploading && progress > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Uploading...</span>
                  <span className="text-gray-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-nytimes-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex space-x-4">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-6 py-3 bg-nytimes-accent text-white rounded-lg hover:bg-nytimes-accent/90 disabled:opacity-50 transition-colors font-medium"
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
              <button
                onClick={() => {
                  setFile(null)
                  setError(null)
                }}
                disabled={uploading}
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Clear
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">💡 How to use:</p>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Select an image or video file</li>
                <li>Click "Upload File"</li>
                <li>URL is automatically copied to clipboard</li>
                <li>Paste URL in article image field</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
