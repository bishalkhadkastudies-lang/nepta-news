'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  responsive?: boolean
  className?: string
}

export default function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseProps) {
  useEffect(() => {
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [slot])

  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
        }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}
