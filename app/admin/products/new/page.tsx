import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/product-form'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-forest-600 hover:text-forest-900"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-forest-950 sm:text-3xl">
          Add product
        </h1>
        <p className="mt-1 text-sm text-forest-600">
          Fill in the details below. It goes live as soon as you save.
        </p>
      </div>

      <ProductForm categories={categories ?? []} />
    </div>
  )
}
