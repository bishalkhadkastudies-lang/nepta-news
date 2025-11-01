'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')

        if (!code) {
          setError('No authorization code received')
          setLoading(false)
          return
        }

        // Exchange code for tokens
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to authenticate')
        }

        const data = await response.json()

        // Store tokens in localStorage
        localStorage.setItem('google_access_token', data.tokens.access_token)
        if (data.tokens.refresh_token) {
          localStorage.setItem('google_refresh_token', data.tokens.refresh_token)
        }
        localStorage.setItem('google_user', JSON.stringify(data.user))

        // Also sync with Supabase if needed
        try {
          const { data: supabaseUser, error: supabaseError } = await supabase
            .from('users')
            .insert([
              {
                google_id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                avatar: data.user.picture,
                provider: 'google',
              },
            ])
            .select()

          if (supabaseError && supabaseError.code !== 'PGRST116') {
            console.error('Supabase sync error:', supabaseError)
          }
        } catch (err) {
          console.error('Supabase sync failed:', err)
        }

        // Redirect to homepage
        router.push('/')
      } catch (err: any) {
        console.error('Callback error:', err)
        setError(err.message || 'Authentication failed')
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nytimes-accent"></div>
          <p className="mt-4 text-gray-600">Signing you in with Google...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-nytimes-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return null
}
