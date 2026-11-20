'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/product'

interface ProductFiltersProps {
  categories: Category[]
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') ?? ''
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep local state in sync when the URL changes externally (back button etc.)
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
    setActiveCategory(searchParams.get('category') ?? '')
  }, [searchParams])

  // Clean up pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const buildUrl = (q: string, cat: string) => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (cat) params.set('category', cat)
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  const pushParams = (q: string, cat: string) => {
    router.replace(buildUrl(q, cat), { scroll: false })
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => pushParams(value, activeCategory), 350)
  }

  const handleCategory = (slug: string) => {
    const next = activeCategory === slug ? '' : slug
    setActiveCategory(next)
    pushParams(query, next)
  }

  const clearAll = () => {
    setQuery('')
    setActiveCategory('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    router.replace(pathname, { scroll: false })
  }

  const hasFilters = Boolean(query || activeCategory)

  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-400"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search fruit by name or description…"
          className="input !pl-11"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleCategory('')}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
            activeCategory === ''
              ? 'border-forest-800 bg-forest-800 text-cream-50'
              : 'border-forest-200 bg-white text-forest-700 hover:bg-forest-50'
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategory(cat.slug)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              activeCategory === cat.slug
                ? 'border-forest-800 bg-forest-800 text-cream-50'
                : 'border-forest-200 bg-white text-forest-700 hover:bg-forest-50'
            )}
          >
            {cat.name}
          </button>
        ))}

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto text-sm font-medium text-forest-600 underline-offset-2 hover:text-forest-900 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
