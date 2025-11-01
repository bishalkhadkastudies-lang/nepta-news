'use client'

import { useRouter } from 'next/navigation'

export function SignInButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/auth/signin')}
      className={className}
    >
      {children}
    </button>
  )
}
