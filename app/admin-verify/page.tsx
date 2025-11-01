'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { LockClosedIcon } from '@heroicons/react/24/outline'

export default function AdminVerifyPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [secretCode, setSecretCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nytimes-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!secretCode.trim()) {
        setError('Please enter the secret code')
        setLoading(false)
        return
      }

      // Verify the secret code
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: secretCode }),
        credentials: 'include' // Include cookies in request
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid secret code')
        setLoading(false)
        return
      }

      // Cookie is set by the API response
      // Wait a moment then redirect to admin dashboard
      await new Promise(resolve => setTimeout(resolve, 300))
      router.push('/admin')
    } catch (err) {
      console.error('Verification error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-nytimes-accent rounded-full p-3">
                <LockClosedIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Verification</h1>
            <p className="text-gray-600 text-sm">
              Welcome, <span className="font-semibold">{user?.email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Secret Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Code
              </label>
              <input
                type="password"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Enter secret code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nytimes-accent focus:border-transparent outline-none transition"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the secret code to access the admin dashboard
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !secretCode.trim()}
              className="w-full bg-nytimes-accent text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Verifying...' : 'Verify & Access Admin'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This is a secure area. Only authorized administrators can access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
