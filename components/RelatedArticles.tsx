'use client'

import Link from 'next/link'
import Image from 'next/image'
import { buildArticleUrl } from '@/lib/slug-utils'

interface RelatedArticle {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  category: string
  publishedAt: string
  slug?: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  return (
    <section className="bg-nytimes-light-gray py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold mb-8">Related Articles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => {
            const articleUrl = article.slug 
              ? buildArticleUrl(article.category, article.slug)
              : `/article/${article.id}`
            
            return (
            <Link
              key={article.id}
              href={articleUrl}
              className="article-card group bg-white"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-nytimes-accent">
                    {article.category}
                  </span>
                </div>
                
                <h3 className="font-serif text-lg font-bold leading-tight mb-2 group-hover:text-nytimes-accent transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-nytimes-gray text-sm mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="text-xs text-nytimes-gray">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RelatedArticles
