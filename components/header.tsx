'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/#contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-cream-50/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="FAWAKIH home">
          <Logo />
          <span
            className="text-xl font-semibold tracking-tight text-forest-900"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            FAWAKIH
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href.split('#')[0])
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-forest-100 text-forest-900'
                    : 'text-forest-700 hover:bg-forest-50'
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/admin"
            className="ml-2 rounded-full border border-forest-200 px-4 py-2 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-50"
          >
            Admin
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-forest-700 hover:bg-forest-50 md:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-forest-100 bg-cream-50 md:hidden"
          aria-label="Mobile"
        >
          <div className="container-page flex flex-col gap-1 py-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-forest-700 hover:bg-forest-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="rounded-lg px-3 py-3 text-sm font-medium text-forest-700 hover:bg-forest-50"
            >
              Admin
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

function Logo() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-cream-50">
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
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
  )
}
