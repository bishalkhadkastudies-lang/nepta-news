import { supabase } from './supabase'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
    return data
  } catch (err: any) {
    console.error('Google sign-in error:', err)
    throw err
  }
}

export async function signUpWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
    return data
  } catch (err: any) {
    console.error('Google sign-up error:', err)
    throw err
  }
}

export async function getGoogleAuthUrl() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID || '',
    redirect_uri: `${window.location.origin}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent',
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function exchangeGoogleCode(code: string) {
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code')
    }

    const data = await response.json()
    return data
  } catch (err: any) {
    console.error('Code exchange error:', err)
    throw err
  }
}
