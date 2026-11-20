import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProductFilters from '@/components/product-filters'
import ProductGrid from '@/components/product-grid'
import Link from 'next/link'

export const revalidate = 30

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Browse our full fresh fruit catalogue with live prices and availability in Malaysian Ringgit.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category: categorySlug } = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  const categoryList = categories ?? []
  const activeCategory = categorySlug
    ? categoryList.find((c) => c.slug === categorySlug)
    : null

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (activeCategory) {
    query = query.eq('category_id', activeCategory.id)
  }

  if (q && q.trim()) {
    // Strip characters that break PostgREST .or() syntax
    const safe = q.trim().replace(/[%,()]/g, ' ')
    if (safe) {
      query = query.or(`name.ilike.%${safe}%,description.ilike.%${safe}%`)
    }
  }

  const { data: products, error } = await query
  const list = products ?? []
  const categoryMap = new Map(categoryList.map((c) => [c.id, c]))
  const hasFilters = Boolean(q?.trim() || activeCategory)

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <nav className="mb-4 text-sm text-forest-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-forest-900">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-forest-900">Products</span>
        </nav>
        <h1 className="text-3xl font-semibold text-forest-950 sm:text-4xl">
          Fresh catalogue
        </h1>
        <p className="mt-2 text-forest-700">
          Prices and availability are updated by the shop — what you see is
          what we have in stock right now.
        </p>
      </header>

      <ProductFilters categories={categoryList} />

      {error ? (
        <div className="card p-8 text-center">
          <p className="text-forest-700">
            Could not load products. Please refresh the page.
          </p>
        </div>
      ) : list.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl" aria-hidden="true">
            🔍
          </p>
          <p className="mt-3 font-medium text-forest-800">
            {hasFilters ? 'No products match your filters.' : 'No products listed yet.'}
          </p>
          {hasFilters && (
            <Link href="/products" className="btn-secondary mt-5">
              Clear filters
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-forest-600">
            {list.length} product{list.length === 1 ? '' : 's'}
            {activeCategory && ` in ${activeCategory.name}`}
            {q?.trim() && ` matching “${q.trim()}”`}
          </p>
          <ProductGrid
            products={list}
            categoryMap={categoryMap}
            priorityFirstN={4}
          />
        </>
      )}
    </div>
  )
          }
