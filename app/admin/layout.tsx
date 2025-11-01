import { Inter } from 'next/font/google'
import AdminSidebar from '@/components/admin/AdminSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard - Nepta News',
  description: 'Admin dashboard for managing articles, categories, and media.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`flex h-screen bg-gray-50 ${inter.className}`}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto lg:ml-0">
        {children}
      </main>
    </div>
  )
}
