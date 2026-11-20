import Image from 'next/image'
import Link from 'next/link'
import AvailabilityBadge from '@/components/availability-badge'
import { formatPrice } from '@/lib/utils'
import type { Category, Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  category?: Category | null
  priority?: boolean
}

export default function ProductCard({
  product,
  category,
  priority = false,
}: ProductCardProps) {
  const isOut = product.status === 'out_of_stock'

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-forest-200 hover:shadow-card-hover focus-visible:-translate-y-1"
      aria-label={`${product.name} — ${formatPrice(product.price)}`}
    >
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={
              'object-cover transition-transform duration-500 group-hover:scale-105 ' +
              (isOut ? 'grayscale' : '')
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center text-forest-200">
            <span className="text-6xl" aria-hidden="true">
              🍎
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3">
          <AvailabilityBadge status={product.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {category && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-forest-500">
            {category.name}
          </p>
        )}
        <h3 className="mt-0.5 truncate text-base font-semibold text-forest-950 sm:text-lg">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-forest-600">
            {product.description}
          </p>
        )}
        <p className="mt-auto pt-3 text-lg font-bold text-forest-800 sm:text-xl">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
