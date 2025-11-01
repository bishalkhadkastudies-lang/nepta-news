import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID || '',
        client_secret: GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${REDIRECT_URI}/auth/google/callback`,
        grant_type: 'authorization_code',
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json()
      console.error('Token exchange error:', error)
      return NextResponse.json(
        { error: 'Failed to exchange authorization code' },
        { status: 400 }
      )
    }

    const tokens = await tokenResponse.json()

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user info' },
        { status: 400 }
      )
    }

    const userInfo = await userResponse.json()

    // Return user data and tokens
    return NextResponse.json({
      success: true,
      user: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      },
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
      },
    })
  } catch (error: any) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    )
  }
}
