'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { buildArticleUrl } from '@/lib/slug-utils'
import { 
  GlobeAltIcon, 
  BriefcaseIcon, 
  CpuChipIcon, 
  BeakerIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface Article {
  id: string
  title: string
  excerpt: string
  image_url: string
  category: string
  slug?: string
  published_at: string
}

interface CategorySection {
  name: string
  icon: any
  color: string
  articles: Article[]
}

const CategoryShowcase = () => {
  const [categories, setCategories] = useState<CategorySection[]>([])
  const [loading, setLoading] = useState(true)

  const categoryConfig = [
    { name: 'World', icon: GlobeAltIcon, color: 'blue' },
    { name: 'Business', icon: BriefcaseIcon, color: 'green' },
    { name: 'Technology', icon: CpuChipIcon, color: 'purple' },
    { name: 'Science', icon: BeakerIcon, color: 'cyan' },
    { name: 'Sports', icon: TrophyIcon, color: 'orange' },
    { name: 'Lifestyle', icon: SparklesIcon, color: 'pink' }
  ]

  useEffect(() => {
    fetchCategoryArticles()
  }, [])

  const fetchCategoryArticles = async () => {
    try {
      // Shuffle and select 3 random categories
      const shuffled = [...categoryConfig].sort(() => Math.random() - 0.5)
      const selectedCategories = shuffled.slice(0, 3)

      // Fetch selected categories in parallel
      const categoryPromises = selectedCategories.map(async (config) => {
        try {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', config.name)
            .single()

          if (!categoryData) return null

          const { data: articles } = await supabase
            .from('articles')
            .select(`
              id,
              title,
              excerpt,
              image_url,
              slug,
              published_at,
              categories!inner (name)
            `)
            .eq('category_id', categoryData.id)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(3)

          if (articles && articles.length > 0) {
            const formattedArticles: Article[] = articles.map((article: any) => ({
              id: article.id,
              title: article.title,
              excerpt: article.excerpt,
              image_url: article.image_url,
              slug: article.slug,
              category: (article.categories as any)?.name || config.name,
              published_at: article.published_at
            }))

            return {
              name: config.name,
              icon: config.icon,
              color: config.color,
              articles: formattedArticles
            }
          }
          return null
        } catch (err) {
          console.error(`Error fetching ${config.name}:`, err)
          return null
        }
      })

      // Wait for all queries to complete in parallel
      const results = await Promise.all(categoryPromises)
      const categorySections = results.filter((cat) => cat !== null) as CategorySection[]
      
      setCategories(categorySections)
    } catch (error) {
      console.error('Error fetching category articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getArticleUrl = (article: Article) => {
    return article.slug 
      ? buildArticleUrl(article.category, article.slug)
      : `/article/${article.id}`
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-600' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', hover: 'hover:bg-cyan-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-600' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'hover:bg-pink-600' }
    }
    return colors[color] || colors.blue
  }

  if (categories.length === 0) {
    return null
  }

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="bg-gray-100 p-4 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">Explore by Category</h2>
          <p className="text-gray-600 text-lg">Discover stories that matter to you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon
            const colors = getColorClasses(category.color)

            return (
              <div key={category.name} className="group">
                {/* Category Header */}
                <Link
                  href={`/${category.name.toLowerCase()}`}
                  className="flex items-center gap-3 mb-6 group/header"
                >
                  <div className={`p-3 ${colors.bg} rounded-xl group-hover/header:${colors.hover} group-hover/header:text-white transition-all`}>
                    <Icon className={`h-6 w-6 ${colors.text} group-hover/header:text-white`} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover/header:${colors.text} transition-colors">
                    {category.name}
                  </h3>
                </Link>

                {/* Articles */}
                <div className="space-y-4">
                  {category.articles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={getArticleUrl(article)}
                      className="group/article block"
                    >
                      {index === 0 ? (
                        // First article - with image
                        <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                              src={article.image_url}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover/article:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-serif text-lg font-bold leading-tight group-hover/article:${colors.text} transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {article.excerpt}
                            </p>
                          </div>
                        </div>
                      ) : (
                        // Other articles - text only
                        <div className="border-l-4 border-gray-200 pl-4 hover:border-${category.color}-600 transition-colors">
                          <h4 className="font-serif font-bold leading-tight group-hover/article:${colors.text} transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>

                {/* View All Link */}
                <Link
                  href={`/${category.name.toLowerCase()}`}
                  className={`inline-block mt-4 text-sm font-medium ${colors.text} hover:underline`}
                >
                  View all {category.name} →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
