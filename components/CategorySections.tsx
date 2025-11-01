'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { buildArticleUrl } from '@/lib/slug-utils'

interface CategoryArticle {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  author: string
  publishedAt: string
  slug?: string
  category?: string
}

interface CategorySection {
  title: string
  href: string
  articles: CategoryArticle[]
}

const mockCategorySections: CategorySection[] = [
  {
    title: 'World',
    href: '/world',
    articles: [
      {
        id: '1',
        title: 'European Union Announces New Trade Agreement with Asian Nations',
        excerpt: 'Historic deal expected to boost economic cooperation and address climate change concerns across continents.',
        imageUrl: '/api/placeholder/300/200',
        author: 'Sophie Laurent',
        publishedAt: '2024-01-15T11:00:00Z'
      },
      {
        id: '2',
        title: 'Peace Talks Resume in Long-Standing Regional Conflict',
        excerpt: 'Diplomats express cautious optimism as negotiations enter critical phase with international mediation.',
        imageUrl: '/api/placeholder/300/200',
        author: 'Hassan Al-Rashid',
        publishedAt: '2024-01-15T10:15:00Z'
      }
    ]
  },
  {
    title: 'Business',
    href: '/business',
    articles: [
      {
        id: '3',
        title: 'Tech Giant Reports Record Quarterly Earnings',
        excerpt: 'Company exceeds analyst expectations with strong growth in cloud computing and AI services.',
        imageUrl: '/api/placeholder/300/200',
        author: 'Mark Stevens',
        publishedAt: '2024-01-15T09:30:00Z'
      },
      {
        id: '4',
        title: 'Automotive Industry Shifts Focus to Electric Vehicles',
        excerpt: 'Major manufacturers announce massive investments in EV production and charging infrastructure.',
        imageUrl: '/api/placeholder/300/200',
        author: 'Nina Petrov',
        publishedAt: '2024-01-15T08:45:00Z'
      }
    ]
  },
  {
    title: 'Technology',
    href: '/tech',
    articles: [
      {
        id: '5',
        title: 'Breakthrough in Quantum Computing Achieved',
        excerpt: 'Researchers demonstrate new quantum processor with unprecedented stability and processing power.',
        imageUrl: '/api/placeholder/300/200',
        author: 'Alex Kumar',
        publishedAt: '2024-01-15T12:00:00Z'
      },
      {
        id: '6',
        title: 'Social Media Platform Launches New Creator Tools',
        excerpt: 'Updated features aim to help content creators better monetize their work and engage with audiences.',
        imageUrl: '/api/placeholder/300/200',
        author: 'Rachel Green',
        publishedAt: '2024-01-15T11:20:00Z'
      }
    ]
  }
]

const CategorySections = () => {
  return (
    <section className="py-12 bg-nytimes-light-gray">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold mb-8">By Section</h2>
        
        <div className="space-y-12">
          {mockCategorySections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold">{section.title}</h3>
                <Link
                  href={section.href}
                  className="flex items-center text-nytimes-accent hover:underline font-medium"
                >
                  View All
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.articles.map((article) => {
                  const articleUrl = article.slug && article.category
                    ? buildArticleUrl(article.category, article.slug)
                    : `/article/${article.id}`
                  
                  return (
                  <Link
                    key={article.id}
                    href={articleUrl}
                    className="group flex space-x-4 p-4 rounded-lg hover:bg-nytimes-light-gray transition-colors"
                  >
                    <div className="flex-shrink-0 w-32 h-24 relative">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg font-bold leading-tight mb-2 group-hover:text-nytimes-accent transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-nytimes-gray text-sm mb-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="text-xs text-nytimes-gray">
                        {article.author} • {new Date(article.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySections
