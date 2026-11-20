'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createProductAction, updateProductAction } from '@/lib/actions/products'
import type { Category, Product, ProductStatus } from '@/types/product'

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'limited', label: 'Limited stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
]

const MAX_IMAGE_BYTES = 4 * 1024 * 1024 // 4 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please choose a JPG, PNG, WebP or GIF image.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be smaller than 4 MB.')
  }
  const supabase = createClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })
  if (error) throw new Error(`Upload failed: ${error.message}`)
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

function extractStoragePath(url: string): string | null {
  const match = url.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const isEdit = Boolean(product)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(
    product?.image_url ?? null
  )
  const [removeImage, setRemoveImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setError(null)
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG, WebP or GIF image.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be smaller than 4 MB.')
      e.target.value = ''
      return
    }
    setRemoveImage(false)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setPreview(null)
    setRemoveImage(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    const file = fileInputRef.current?.files?.[0]

    startTransition(async () => {
      try {
        let imageUrl: string | null = product?.image_url ?? null
        if (removeImage) imageUrl = null
        if (file) {
          // Delete the old image first (best-effort)
          if (product?.image_url) {
            const oldPath = extractStoragePath(product.image_url)
            if (oldPath) {
              const supabase = createClient()
              await supabase.storage
                .from('product-images')
                .remove([oldPath])
            }
          }
          imageUrl = await uploadImage(file)
        }
        formData.set('image_url', imageUrl ?? '')

        const result =
          isEdit && product
            ? await updateProductAction(product.id, formData)
            : await createProductAction(formData)

        if (result.error) {
          setError(result.error)
          return
        }

        router.push('/admin/products')
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      <section className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-forest-950">
          Product details
        </h2>

        <div>
          <label htmlFor="name" className="label">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            defaultValue={product?.name ?? ''}
            className="input"
            placeholder="e.g. Mango"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={2000}
            defaultValue={product?.description ?? ''}
            className="input resize-y"
            placeholder="Short description shown on the product card."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="label">
              Price (RM) <span className="text-red-600">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              max="9999999"
              step="0.01"
              required
              inputMode="decimal"
              defaultValue={product ? Number(product.price) : ''}
              className="input"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="category_id" className="label">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={product?.category_id ?? ''}
              className="input"
            >
              <option value="">Uncategorised</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="label">
              Availability <span className="text-red-600">*</span>
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue={product?.status ?? 'available'}
              className="input"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="display_order" className="label">
              Display order
            </label>
            <input
              id="display_order"
              name="display_order"
              type="number"
              min="0"
              max="9999"
              step="1"
              defaultValue={product?.display_order ?? 0}
              className="input"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-forest-100 bg-cream-50 p-3">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={product?.is_published ?? true}
            className="mt-1 h-4 w-4 rounded border-forest-300 text-forest-700 focus:ring-forest-500"
          />
          <span className="text-sm text-forest-800">
            <strong>Published</strong>
            <span className="block text-xs text-forest-600">
              Show this product on the public site.
            </span>
          </span>
        </label>
      </section>

      <section className="card space-y-4 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-forest-950">Image</h2>

        {preview && (
          <div className="relative aspect-square w-40 overflow-hidden rounded-xl border border-forest-100 bg-cream-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div>
          <label htmlFor="image" className="label">
            {product?.image_url ? 'Replace image' : 'Upload image'}
          </label>
          <input
            id="image"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="block w-full text-sm text-forest-700 file:mr-3 file:rounded-full file:border-0 file:bg-forest-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream-50 hover:file:bg-forest-800"
          />
          <p className="mt-1 text-xs text-forest-500">
            JPG, PNG, WebP or GIF · max 4 MB
          </p>
        </div>

        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Remove image
          </button>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="btn-secondary"
          disabled={pending}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending
            ? 'Saving…'
            : isEdit
              ? 'Save changes'
              : 'Create product'}
        </button>
      </div>
    </form>
  )
}
