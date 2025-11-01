'use client'

import { useEffect, useState } from 'react'

interface ReadingProgressProps {
  readTime: number
}

const ReadingProgress = ({ readTime }: ReadingProgressProps) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(readTime)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      
      setScrollProgress(scrollPercent)

      // Calculate estimated time left based on scroll progress
      const timeElapsed = Math.round((readTime * scrollPercent) / 100)
      const timeLeft = Math.max(0, readTime - timeElapsed)
      setEstimatedTimeLeft(timeLeft)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [readTime])

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-nytimes-accent transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reading Time Indicator */}
      <div className="fixed bottom-6 right-6 bg-white rounded-full shadow-lg p-3 z-40 hidden md:flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs font-semibold text-nytimes-accent">
            {estimatedTimeLeft} min left
          </div>
          <div className="text-xs text-gray-500">
            {Math.round(scrollProgress)}%
          </div>
        </div>
      </div>
    </>
  )
}

export default ReadingProgress
