import { Metadata } from 'next'
import Header from '@/components/Header'
import CategoryNav from '@/components/CategoryNav'
import BreakingNews from '@/components/BreakingNews'
import ModernHero from '@/components/ModernHero'
import TrendingGrid from '@/components/TrendingGrid'
import EditorsPicksSection from '@/components/EditorsPicksSection'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Nepta News - Breaking News, World News, Politics, Business & More',
  description: 'Nepta News delivers breaking news, world news, politics, business, technology, science, health, sports, arts, and opinion. Stay informed with latest news coverage.',
  keywords: 'news, breaking news, world news, politics, business, technology, science, health, sports, arts, opinion, current events',
  openGraph: {
    title: 'Nepta News - Breaking News & World News',
    description: 'Stay updated with breaking news, world news, politics, business, technology, science, health, sports, and more.',
    url: 'https://neptanews.com',
    type: 'website',
    images: [
      {
        url: 'https://fcpkknncvrudppocgage.supabase.co/storage/v1/object/public/assests/logo.png',
        width: 1200,
        height: 630,
        alt: 'Nepta News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepta News - Breaking News & World News',
    description: 'Stay updated with breaking news, world news, politics, business, technology, science, health, sports, and more.',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Nepta News',
          url: 'https://neptanews.com',
          description: 'Nepta News delivers breaking news, world news, politics, business, technology, science, health, sports, arts, and opinion.',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://neptanews.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        })}
      </script>
      <Header />
      <CategoryNav />
      <BreakingNews />
      <main>
        <ModernHero />
        <TrendingGrid />
        <EditorsPicksSection />
      </main>
      <Footer />
    </div>
  )
}
