'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { SignInButton } from '@/components/auth/SignInButton'
import { TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Comment {
  id: string
  user_id: string
  content: string
  created_at: string
}

interface CommentsSectionProps {
  articleId: string
}

const CommentsSection = ({ articleId }: CommentsSectionProps) => {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/comments/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, limit: 50, offset: 0 })
      })
      const data = await response.json()
      setComments(data.comments || [])
      setError('')
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('Please sign in to comment')
      return
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty')
      return
    }

    if (newComment.length > 1000) {
      setError('Comment must be less than 1000 characters')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          content: newComment
        })
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      const comment = await response.json()
      setComments([comment, ...comments])
      setNewComment('')
      setError('')
    } catch (err) {
      console.error('Error posting comment:', err)
      setError('Failed to post comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      const response = await fetch('/api/comments/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      setComments(comments.filter(c => c.id !== commentId))
    } catch (err) {
      console.error('Error deleting comment:', err)
      setError('Failed to delete comment')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 border-t border-nytimes-border">
      <h2 className="text-3xl font-serif font-bold mb-8">Comments</h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-nytimes-black mb-2">
              Your Comment
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this article..."
              maxLength={1000}
              rows={4}
              className="w-full px-4 py-3 border border-nytimes-border rounded-lg focus:outline-none focus:ring-2 focus:ring-nytimes-accent resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-nytimes-gray">
                {newComment.length}/1000 characters
              </span>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-6 py-2 bg-nytimes-accent text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}
        </form>
      ) : (
        <div className="mb-8 p-6 bg-nytimes-light-gray rounded-lg text-center">
          <p className="text-nytimes-gray mb-4">Sign in to comment on this article</p>
          <Link href="/auth/signin">
            <button className="px-6 py-2 bg-nytimes-accent text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-nytimes-gray">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="pb-6 border-b border-nytimes-border last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-nytimes-black">
                    {comment.user_id === user?.id ? 'You' : 'Anonymous User'}
                  </p>
                  <p className="text-xs text-nytimes-gray">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                {comment.user_id === user?.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-nytimes-gray hover:text-red-500 transition-colors"
                    title="Delete comment"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-nytimes-black leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default CommentsSection
