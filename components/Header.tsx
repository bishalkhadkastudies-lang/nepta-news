'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MagnifyingGlassIcon, Bars3Icon, BookmarkIcon, CogIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/components/auth/AuthProvider'
import { SignInButton } from '@/components/auth/SignInButton'
import { UserButton } from '@/components/auth/UserButton'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'bishal.khadka.studies@gmail.com'

const Header = () => {
  const { user, loading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const isAdmin = user?.email === ADMIN_EMAIL

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set('q', searchQuery)
      window.location.href = `/search?${params.toString()}`
    }
  }

  const sections = [
    { name: 'Home', href: '/' },
    { name: 'World', href: '/world' },
    { name: 'U.S.', href: '/us' },
    { name: 'Politics', href: '/politics' },
    { name: 'Business', href: '/business' },
    { name: 'Tech', href: '/tech' },
    { name: 'Science', href: '/science' },
    { name: 'Health', href: '/health' },
    { name: 'Sports', href: '/sports' },
    { name: 'Arts', href: '/arts' },
    { name: 'Opinion', href: '/opinion' },
  ]

  return (
    <header className="border-b border-nytimes-border">
      {/* Top Bar */}
      <div className="bg-nytimes-black text-white py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs">
          <div className="flex space-x-4">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>Today's Paper</span>
          </div>
          <div className="flex space-x-4">
            <Link href="/subscribe" className="hover:underline">Subscribe</Link>
            <Link href="/login" className="hover:underline">Log In</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="https://fcpkknncvrudppocgage.supabase.co/storage/v1/object/public/assests/logo%20(1).png"
                alt="Nepta News Logo"
                width={80}
                height={80}
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {sections.map((section) => (
                <Link
                  key={section.name}
                  href={section.href}
                  className="text-sm font-medium text-nytimes-black hover:text-nytimes-accent transition-colors"
                >
                  {section.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-nytimes-light-gray rounded-full transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-nytimes-black" />
              </button>

              {/* Admin Link */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="p-2 hover:bg-nytimes-light-gray rounded-full transition-colors"
                  title="Admin Dashboard"
                >
                  <CogIcon className="h-5 w-5 text-nytimes-black" />
                </Link>
              )}

              {/* Saved Articles Link */}
              {user && (
                <Link
                  href="/saved"
                  className="p-2 hover:bg-nytimes-light-gray rounded-full transition-colors"
                  title="Saved articles"
                >
                  <BookmarkIcon className="h-5 w-5 text-nytimes-black" />
                </Link>
              )}

              {/* Supabase Authentication */}
              {!loading && (
                <>
                  {!user ? (
                    <>
                      <SignInButton className="text-sm font-medium text-nytimes-black hover:text-nytimes-accent transition-colors">
                        Sign In
                      </SignInButton>
                      <Link
                        href="/auth/signup"
                        className="text-sm font-medium text-nytimes-black hover:text-nytimes-accent transition-colors"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <UserButton />
                  )}
                </>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-nytimes-light-gray rounded-full transition-colors"
              >
                <Bars3Icon className="h-5 w-5 text-nytimes-black" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <form onSubmit={handleSearch} className="mt-4 pb-4 border-b border-nytimes-border">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-nytimes-border rounded-lg focus:outline-none focus:ring-2 focus:ring-nytimes-accent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 hover:opacity-70 transition-opacity"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-nytimes-gray" />
                </button>
              </div>
            </form>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-b border-nytimes-border">
              <div className="grid grid-cols-2 gap-2">
                {sections.map((section) => (
                  <Link
                    key={section.name}
                    href={section.href}
                    className="text-sm font-medium text-nytimes-black hover:text-nytimes-accent transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {section.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
