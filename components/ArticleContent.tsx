'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  ShareIcon, 
  BookmarkIcon, 
  HeartIcon,
  ChatBubbleLeftIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'

interface ArticleContentProps {
  article: {
    id: string
    title: string
    excerpt: string
    content: string
    image_url: string
    category: string
    author: string
    published_at: string
    read_time: number
    tags: string[]
    views?: number
    slug?: string
  }
}

const ArticleContent = ({ article }: ArticleContentProps) => {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  useEffect(() => {
    fetchLikeCount()
    if (user) {
      checkIfBookmarked()
      checkIfLiked()
    }
  }, [user, article.id])

  const fetchLikeCount = async () => {
    try {
      const response = await fetch('/api/likes/count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id })
      })
      const data = await response.json()
      setLikeCount(data.count || 0)
    } catch (error) {
      console.error('Error fetching like count:', error)
    }
  }

  const checkIfLiked = async () => {
    try {
      const response = await fetch('/api/likes/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id })
      })
      const data = await response.json()
      setIsLiked(data.isLiked)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const checkIfBookmarked = async () => {
    try {
      const response = await fetch('/api/bookmarks/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id })
      })
      const data = await response.json()
      setIsBookmarked(data.isSaved)
    } catch (error) {
      console.error('Error checking bookmark status:', error)
    }
  }

  const handleLike = async () => {
    if (!user) {
      window.location.href = '/auth/signin'
      return
    }

    setLikeLoading(true)
    try {
      const response = await fetch('/api/likes/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id })
      })
      const data = await response.json()
      setIsLiked(data.liked)
      setLikeCount(prev => data.liked ? prev + 1 : prev - 1)
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLikeLoading(false)
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      // Redirect to sign in
      window.location.href = '/auth/signin'
      return
    }

    setBookmarkLoading(true)
    try {
      if (isBookmarked) {
        // Unsave article
        const response = await fetch('/api/bookmarks/unsave', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId: article.id })
        })
        if (response.ok) {
          setIsBookmarked(false)
        }
      } else {
        // Save article
        const response = await fetch('/api/bookmarks/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId: article.id })
        })
        if (response.ok) {
          setIsBookmarked(true)
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setBookmarkLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          <Link 
            href={`/${article.category.toLowerCase()}`}
            className="text-sm font-semibold uppercase tracking-wide text-nytimes-accent hover:underline"
          >
            {article.category}
          </Link>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-serif font-bold leading-tight mb-6">
          {article.title}
        </h1>
        
        <p className="text-xl text-nytimes-gray leading-relaxed mb-6">
          {article.excerpt}
        </p>
        
        <div className="flex flex-wrap items-center justify-between pb-6 border-b border-nytimes-border">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-nytimes-black">
                {article.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="font-medium text-nytimes-black">{article.author}</div>
              <div className="text-sm text-nytimes-gray">
                {new Date(article.published_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-nytimes-gray">
            <ClockIcon className="h-4 w-4" />
            <span>{article.read_time} min read</span>
          </div>
        </div>
      </header>

      {/* Main Image */}
      <div className="mb-8">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Article Actions */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-nytimes-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className="flex items-center space-x-2 text-nytimes-gray hover:text-red-500 transition-colors disabled:opacity-50"
            title={user ? (isLiked ? 'Unlike' : 'Like') : 'Sign in to like'}
          >
            {isLiked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className="flex items-center space-x-2 text-nytimes-gray hover:text-nytimes-accent transition-colors disabled:opacity-50"
            title={user ? (isBookmarked ? 'Remove from saved' : 'Save for later') : 'Sign in to save'}
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="h-5 w-5 text-nytimes-accent" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-nytimes-gray hover:text-nytimes-accent transition-colors"
          >
            <ShareIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
          
          <button className="flex items-center space-x-2 text-nytimes-gray hover:text-nytimes-accent transition-colors">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Comment</span>
          </button>
        </div>
      </div>

      {/* Article Body */}
      <div className="prose prose-lg max-w-none mb-8">
        <div 
          dangerouslySetInnerHTML={{ __html: article.content }}
          className="font-serif text-lg leading-relaxed text-nytimes-black"
        />
      </div>

      {/* Tags */}
      <div className="mb-8 pb-8 border-b border-nytimes-border">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag.toLowerCase().replace(' ', '-')}`}
              className="px-3 py-1 bg-nytimes-light-gray text-nytimes-gray text-sm rounded-full hover:bg-nytimes-accent hover:text-white transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

    </article>
  )
}

export default ArticleContent
