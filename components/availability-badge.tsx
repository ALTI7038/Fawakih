import { cn } from '@/lib/utils'
import type { ProductStatus } from '@/types/product'

const META: Record<
  ProductStatus,
  { label: string; classes: string; dot: string }
> = {
  available: {
    label: 'Available',
    classes: 'border-forest-300 bg-forest-100 text-forest-800',
    dot: 'bg-forest-500',
  },
  limited: {
    label: 'Limited Stock',
    classes: 'border-amber-300 bg-amber-50 text-amber-800',
    dot: 'bg-amber-500',
  },
  out_of_stock: {
    label: 'Out of Stock',
    classes: 'border-red-200 bg-red-50 text-red-700',
    dot: 'bg-red-500',
  },
}

export default function AvailabilityBadge({
  status,
  className,
}: {
  status: ProductStatus
  className?: string
}) {
  const meta = META[status] ?? META.available
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        meta.classes,
        className
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', meta.dot)}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  )
}
