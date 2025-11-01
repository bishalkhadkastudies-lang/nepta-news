import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nepta News - Breaking News, World News, Politics, Business & More',
  description: 'Nepta News delivers breaking news, world news, politics, business, technology, science, health, sports, arts, and opinion. Stay informed with latest news coverage.',
  keywords: 'news, breaking news, world news, politics, business, technology, science, health, sports, arts, opinion, current events',
  authors: [{ name: 'Nepta News' }],
  creator: 'Nepta News',
  publisher: 'Nepta News',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neptanews.com',
    siteName: 'Nepta News',
    title: 'Nepta News - Breaking News & World News',
    description: 'Stay updated with breaking news, world news, politics, business, technology, science, health, sports, and more.',
    images: [
      {
        url: 'https://fcpkknncvrudppocgage.supabase.co/storage/v1/object/public/assests/logo%20(1).png',
        width: 1200,
        height: 630,
        alt: 'Nepta News Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepta News - Breaking News & World News',
    description: 'Stay updated with breaking news, world news, politics, business, technology, science, health, sports, and more.',
    images: ['https://fcpkknncvrudppocgage.supabase.co/storage/v1/object/public/assests/logo%20(1).png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://neptanews.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="icon" href="https://fcpkknncvrudppocgage.supabase.co/storage/v1/object/public/assests/logo%20(1).png" />
        <link rel="apple-touch-icon" href="https://fcpkknncvrudppocgage.supabase.co/storage/v1/object/public/assests/logo%20(1).png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsMediaOrganization',
            name: 'Nepta News',
            url: 'https://neptanews.com',
            logo: 'https://fcpkknncvrudppocgage.supabase.co/storage/v1/object/public/assests/logo%20(1).png',
            description: 'Nepta News delivers breaking news, world news, politics, business, technology, science, health, sports, arts, and opinion.',
            sameAs: [
              'https://twitter.com/neptanews',
              'https://facebook.com/neptanews',
            ],
          })}
        </script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
