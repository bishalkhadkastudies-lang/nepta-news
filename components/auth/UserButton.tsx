'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function UserButton() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const getInitials = () => {
    const email = user.email || ''
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-nytimes-accent text-white flex items-center justify-center text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        {getInitials()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
          </div>
          <Link
            href="/saved"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Saved Articles
          </Link>
          <button
            onClick={() => {
              signOut()
              setIsOpen(false)
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
