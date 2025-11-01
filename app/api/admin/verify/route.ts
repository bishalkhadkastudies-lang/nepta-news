import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'bishal.khadka.studies@gmail.com'
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || 'adminloveyou'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user email matches admin email
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get the secret code from request
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Secret code is required' },
        { status: 400 }
      )
    }

    // Verify the secret code
    if (code !== ADMIN_SECRET_CODE) {
      return NextResponse.json(
        { error: 'Invalid secret code' },
        { status: 401 }
      )
    }

    // Return success response with cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_verified', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })
    return response
  } catch (error) {
    console.error('Admin verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
