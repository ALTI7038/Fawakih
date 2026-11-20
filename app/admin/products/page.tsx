import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import AvailabilityBadge from '@/components/availability-badge'
import DeleteProductButton from '@/components/delete-product-button'
import { formatPrice } from '@/lib/utils'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true }),
    supabase.from('categories').select('*'),
  ])

  const products = productsRes.data ?? []
  const categoryMap = new Map(
    (categoriesRes.data ?? []).map((c) => [c.id, c.name])
  )

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-forest-950 sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-forest-600">
            {products.length} product{products.length === 1 ? '' : 's'} in your
            catalogue
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + Add product
        </Link>
      </header>

      {productsRes.error && (
        <div className="card p-6">
          <p className="error-text">
            Could not load products. Please refresh the page.
          </p>
        </div>
      )}

      {!productsRes.error && products.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-4xl" aria-hidden="true">
            🍎
          </p>
          <p className="mt-3 text-forest-800">No products yet.</p>
          <p className="mt-1 text-sm text-forest-600">
            Add your first product to show it on the public site.
          </p>
          <Link href="/admin/products/new" className="btn-primary mt-5">
            Add product
          </Link>
        </div>
      )}

      {products.length > 0 && (
        <ul className="space-y-3">
          {products.map((p) => {
            const categoryName = p.category_id
              ? categoryMap.get(p.category_id)
              : null
            return (
              <li
                key={p.id}
                className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-cream-100 sm:h-16 sm:w-16">
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl">
                      🍎
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold text-forest-950">
                      {p.name}
                    </h2>
                    {!p.is_published && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-forest-500">
                    {categoryName ?? 'Uncategorised'}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-forest-800">
                      {formatPrice(p.price)}
                    </span>
                    <AvailabilityBadge status={p.status} />
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="btn-secondary !px-4 !py-2 !text-xs"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
                  }
