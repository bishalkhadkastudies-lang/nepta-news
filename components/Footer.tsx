'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribing:', email)
    setEmail('')
  }

  const footerSections = [
    {
      title: 'News',
      links: [
        { name: 'Home', href: '/' },
        { name: 'World', href: '/world' },
        { name: 'U.S.', href: '/us' },
        { name: 'Politics', href: '/politics' },
        { name: 'Business', href: '/business' },
        { name: 'Tech', href: '/tech' },
        { name: 'Science', href: '/science' },
        { name: 'Health', href: '/health' },
      ]
    },
    {
      title: 'Opinion',
      links: [
        { name: 'Today\'s Opinion', href: '/opinion' },
        { name: 'Columnists', href: '/opinion/columnists' },
        { name: 'Editorials', href: '/opinion/editorials' },
        { name: 'Guest Essays', href: '/opinion/guest' },
        { name: 'Letters', href: '/opinion/letters' },
      ]
    },
    {
      title: 'Arts',
      links: [
        { name: 'Today\'s Arts', href: '/arts' },
        { name: 'Art & Design', href: '/arts/design' },
        { name: 'Books', href: '/arts/books' },
        { name: 'Movies', href: '/arts/movies' },
        { name: 'Music', href: '/arts/music' },
        { name: 'Pop Culture', href: '/arts/pop' },
        { name: 'Television', href: '/arts/television' },
        { name: 'Theater', href: '/arts/theater' },
      ]
    },
    {
      title: 'Living',
      links: [
        { name: 'Automotive', href: '/living/automotive' },
        { name: 'Games', href: '/living/games' },
        { name: 'Education', href: '/living/education' },
        { name: 'Food', href: '/living/food' },
        { name: 'Health', href: '/living/health' },
        { name: 'Jobs', href: '/living/jobs' },
        { name: 'Love', href: '/living/love' },
        { name: 'Magazine', href: '/living/magazine' },
      ]
    },
    {
      title: 'More',
      links: [
        { name: 'Reader Center', href: '/reader-center' },
        { name: 'Wirecutter', href: '/wirecutter' },
        { name: 'Cooking', href: '/cooking' },
        { name: 'Live Events', href: '/events' },
        { name: 'The Learning Network', href: '/learning' },
        { name: 'Tools & Services', href: '/tools' },
        { name: 'Podcasts', href: '/podcasts' },
        { name: 'Video', href: '/video' },
        { name: 'Graphics', href: '/graphics' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'LinkedIn', href: '#' },
  ]

  return (
    <footer className="bg-nytimes-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-serif font-bold mb-4">
              The Morning Newsletter
            </h3>
            <p className="text-gray-300 mb-6">
              Get what you need to know to start your day, delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4" suppressHydrationWarning>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-nytimes-accent text-white placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="btn-primary bg-nytimes-accent hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-serif text-lg font-bold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-2xl font-serif font-bold">Nepta News</span>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-300">
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/careers" className="hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/permissions" className="hover:text-white transition-colors">
                Permissions
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© 2024 Nepta News. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
