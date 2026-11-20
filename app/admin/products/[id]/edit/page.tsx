import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/product-form'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [productRes, categoriesRes] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true }),
  ])

  if (productRes.error || !productRes.data) notFound()

  const product = productRes.data

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
          Edit product
        </h1>
        <p className="mt-1 text-sm text-forest-600">
          Changes are visible on the public site immediately after saving.
        </p>
      </div>

      <ProductForm product={product} categories={categoriesRes.data ?? []} />
    </div>
  )
}
