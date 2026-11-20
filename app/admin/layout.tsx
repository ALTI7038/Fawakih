import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin-sidebar'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdmin = user?.app_metadata?.role === 'admin'

  if (!isAdmin) {
    // Only the login page should render here — middleware blocks the rest.
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream-100 p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-cream-100 lg:flex">
      <AdminSidebar email={user.email ?? ''} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  )
}
