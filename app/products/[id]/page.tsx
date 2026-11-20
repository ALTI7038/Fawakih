import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AvailabilityBadge from '@/components/availability-badge'
import { formatPrice } from '@/lib/utils'

export const revalidate = 30

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle()

  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.description ?? undefined,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle()

  if (!product) notFound()

  const { data: category } = product.category_id
    ? await supabase
        .from('categories')
        .select('*')
        .eq('id', product.category_id)
        .maybeSingle()
    : { data: null }

  // Related products (same category, excluding current one)
  const { data: related } = product.category_id
    ? await supabase
        .from('products')
        .select('id, name, price, image_url, status')
        .eq('is_published', true)
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(4)
    : { data: null }

  const isOutOfStock = product.status === 'out_of_stock'

  return (
    <div className="container-page py-10 sm:py-14">
      <nav className="mb-6 text-sm text-forest-600" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-forest-900">
          Home
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <Link href="/products" className="hover:text-forest-900">
          Products
        </Link>
        {category && (
          <>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <Link
              href={`/products?category=${category.slug}`}
              className="hover:text-forest-900"
            >
              {category.name}
            </Link>
          </>
        )}
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-forest-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-forest-100 bg-cream-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={'object-cover ' + (isOutOfStock ? 'grayscale' : '')}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-forest-200">
              <span className="text-8xl" aria-hidden="true">
                🍎
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {category && (
            <p className="text-xs font-semibold uppercase tracking-wider text-forest-600">
              {category.name}
            </p>
          )}
          <h1 className="mt-1 text-3xl font-semibold text-forest-950 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4">
            <AvailabilityBadge status={product.status} />
          </div>

          <p className="mt-6 text-3xl font-bold text-forest-800">
            {formatPrice(product.price)}
          </p>
          <p className="mt-1 text-xs text-forest-500">
            Price in Malaysian Ringgit (RM)
          </p>

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-forest-700">
              {product.description}
            </p>
          )}

          <div className="mt-8 rounded-xl border border-forest-100 bg-cream-50 p-4 text-sm text-forest-700">
            <p className="font-medium text-forest-900">About availability</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
              <li>
                <strong>Available</strong> — fresh in stock today.
              </li>
              <li>
                <strong>Limited stock</strong> — running low, come early.
              </li>
              <li>
                <strong>Out of stock</strong> — check back soon.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-secondary">
              ← Back to catalogue
            </Link>
            <Link href="/#contact" className="btn-primary">
              Contact the shop
            </Link>
          </div>
        </div>
      </div>

      {related && related.length > 0 && (
        <section className="mt-16 border-t border-forest-100 pt-10">
          <h2 className="text-2xl font-semibold text-forest-950">
            You might also like
          </h2>
          <ul
            role="list"
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative aspect-square overflow-hidden bg-cream-100">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🍎
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-forest-950">
                      {p.name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-forest-800">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
