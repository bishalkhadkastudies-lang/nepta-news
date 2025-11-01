'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
}

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
        return
      }

      setCategories(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || categories.length === 0) {
    return null
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex overflow-x-auto space-x-1 md:space-x-4 py-4">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-nytimes-accent hover:bg-gray-50 rounded whitespace-nowrap transition-colors"
          >
            Home
          </Link>
          {categories.map((category) => {
            const slug = category.slug || generateSlug(category.name)
            return (
              <Link
                key={category.id}
                href={`/${slug}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-nytimes-accent hover:bg-gray-50 rounded whitespace-nowrap transition-colors"
              >
                {category.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
