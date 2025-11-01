import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase-middleware'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'bishal.khadka.studies@gmail.com'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  
  const { pathname } = request.nextUrl

  // Admin verify page - requires authentication and admin email
  if (pathname.startsWith('/admin-verify')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    return supabaseResponse
  }

  // Admin routes - requires authentication, admin email, and verification
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Check if user has verified with secret code
    const adminVerified = request.cookies.get('admin_verified')?.value
    if (adminVerified !== 'true') {
      return NextResponse.redirect(new URL('/admin-verify', request.url))
    }
    
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
