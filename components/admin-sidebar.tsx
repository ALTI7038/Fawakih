'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import SignOutButton from '@/components/sign-out-button'

interface NavItem {
  href: string
  label: string
  isActive: (pathname: string) => boolean
}

const NAV: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    isActive: (p) => p === '/admin',
  },
  {
    href: '/admin/products',
    label: 'Products',
    isActive: (p) =>
      p === '/admin/products' ||
      (p.startsWith('/admin/products/') && !p.startsWith('/admin/products/new')),
  },
  {
    href: '/admin/products/new',
    label: 'Add Product',
    isActive: (p) => p === '/admin/products/new',
  },
]

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname()

  return (
    <aside className="border-b border-forest-800 bg-forest-950 text-cream-100 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:flex-shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:flex-col lg:items-stretch lg:px-6 lg:py-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </span>
          <span
            className="text-lg font-semibold tracking-tight text-cream-50"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            FAWAKIH
          </span>
          <span className="rounded-full bg-forest-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream-100/80">
            Admin
          </span>
        </Link>
        <div className="lg:mt-3">
          <SignOutButton />
        </div>
      </div>

      <p
        className="hidden truncate border-t border-forest-800/60 px-6 py-3 text-xs text-cream-100/60 lg:block"
        title={email}
      >
        {email}
      </p>

      <nav
        aria-label="Admin"
        className="flex gap-1 overflow-x-auto px-2 pb-3 lg:mt-2 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-4"
      >
        {NAV.map((item) => {
          const active = item.isActive(pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-forest-800 text-cream-50'
                  : 'text-cream-100/70 hover:bg-forest-900 hover:text-cream-50'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
