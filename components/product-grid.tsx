import ProductCard from '@/components/product-card'
import type { Category, Product } from '@/types/product'

interface ProductGridProps {
  products: Product[]
  categoryMap: Map<string, Category>
  priorityFirstN?: number
}

export default function ProductGrid({
  products,
  categoryMap,
  priorityFirstN = 0,
}: ProductGridProps) {
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product, index) => (
        <li
          key={product.id}
          className="animate-fade-in"
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        >
          <ProductCard
            product={product}
            category={product.category_id ? categoryMap.get(product.category_id) : null}
            priority={index < priorityFirstN}
          />
        </li>
      ))}
    </ul>
  )
}
