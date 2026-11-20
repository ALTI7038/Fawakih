import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import AvailabilityBadge from '@/components/availability-badge'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    return (
      <div className="card p-6">
        <p className="error-text">
          Could not load dashboard data. Please refresh the page.
        </p>
      </div>
    )
  }

  const list = products ?? []
  const total = list.length
  const published = list.filter((p) => p.is_published).length
  const drafts = total - published
  const limited = list.filter((p) => p.status === 'limited').length
  const outOfStock = list.filter((p) => p.status === 'out_of_stock').length
  const recent = list.slice(0, 5)

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-forest-950 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-forest-600">
            Manage your catalogue and check what customers see.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + Add product
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total products" value={total} />
        <StatCard label="Published" value={published} hint={`${drafts} draft${drafts === 1 ? '' : 's'}`} />
        <StatCard label="Limited stock" value={limited} tone="amber" />
        <StatCard label="Out of stock" value={outOfStock} tone="red" />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-forest-950">
            Recently updated
          </h2>
          <Link
            href="/admin/products"
            className="text-sm font-medium text-forest-700 hover:text-forest-900"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-3xl" aria-hidden="true">
              🍃
            </p>
            <p className="mt-2 text-sm text-forest-700">
              No products yet. Add your first one to get started.
            </p>
            <Link href="/admin/products/new" className="btn-primary mt-4">
              Add product
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="card flex items-center gap-4 p-3 transition-colors hover:border-forest-200"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-cream-100">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">
                        🍎
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-forest-950">
                      {p.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-forest-800">
                        {formatPrice(p.price)}
                      </span>
                      <AvailabilityBadge status={p.status} />
                      {!p.is_published && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-forest-600">
                    Edit
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  tone = 'green',
}: {
  label: string
  value: number
  hint?: string
  tone?: 'green' | 'amber' | 'red'
}) {
  const toneClasses =
    tone === 'amber'
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : tone === 'red'
        ? 'border-red-200 bg-red-50 text-red-900'
        : 'border-forest-100 bg-white text-forest-950'
  return (
    <div className={`rounded-2xl border p-5 shadow-card ${toneClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs opacity-70">{hint}</p>}
    </div>
  )
}
