'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProductStatus } from '@/types/database'

export interface ActionResult {
  error?: string
  success?: boolean
}

const VALID_STATUSES: ProductStatus[] = ['available', 'limited', 'out_of_stock']

function readString(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

interface ValidatedProduct {
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: string | null
  status: ProductStatus
  display_order: number
  is_published: boolean
}

function validate(formData: FormData):
  | { ok: true; value: ValidatedProduct }
  | { ok: false; error: string } {
  const name = readString(formData, 'name')
  const description = readString(formData, 'description')
  const priceRaw = readString(formData, 'price')
  const imageUrl = readString(formData, 'image_url')
  const categoryId = readString(formData, 'category_id')
  const statusRaw = readString(formData, 'status')
  const displayOrderRaw = readString(formData, 'display_order')
  const isPublished =
    formData.get('is_published') === 'on' ||
    formData.get('is_published') === 'true'

  if (name.length < 2) return { ok: false, error: 'Name must be at least 2 characters.' }
  if (name.length > 120) return { ok: false, error: 'Name must be 120 characters or fewer.' }
  if (description.length > 2000) return { ok: false, error: 'Description is too long (max 2,000).' }

  const price = Number(priceRaw)
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: 'Price must be a number of RM 0 or more.' }
  }
  if (price > 9_999_999) {
    return { ok: false, error: 'Price is too large.' }
  }

  if (!VALID_STATUSES.includes(statusRaw as ProductStatus)) {
    return { ok: false, error: 'Invalid availability status.' }
  }

  const displayOrder = Number(displayOrderRaw || '0')
  if (!Number.isInteger(displayOrder) || displayOrder < 0 || displayOrder > 9999) {
    return { ok: false, error: 'Display order must be a whole number between 0 and 9999.' }
  }

  return {
    ok: true,
    value: {
      name,
      description: description || null,
      price: Number(price.toFixed(2)),
      image_url: imageUrl || null,
      category_id: categoryId || null,
      status: statusRaw as ProductStatus,
      display_order: displayOrder,
      is_published: isPublished,
    },
  }
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return { supabase: null, error: 'Access denied.' } as const
  }
  return { supabase, error: null } as const
}

function extractStoragePath(url: string): string | null {
  const match = url.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin()
  if (!supabase) return { error: authError ?? 'Access denied.' }

  const result = validate(formData)
  if (!result.ok) return { error: result.error }

  const { error } = await supabase.from('products').insert(result.value)
  if (error) {
    console.error('Create product failed:', error)
    return { error: 'Could not create product. Please try again.' }
  }

  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateProductAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin()
  if (!supabase) return { error: authError ?? 'Access denied.' }

  if (!id || typeof id !== 'string') return { error: 'Missing product ID.' }

  const result = validate(formData)
  if (!result.ok) return { error: result.error }

  const { error } = await supabase
    .from('products')
    .update(result.value)
    .eq('id', id)

  if (error) {
    console.error('Update product failed:', error)
    return { error: 'Could not update product. Please try again.' }
  }

  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath(`/products/${id}`)
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin()
  if (!supabase) return { error: authError ?? 'Access denied.' }

  if (!id || typeof id !== 'string') return { error: 'Missing product ID.' }

  const { data: existing } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    console.error('Delete product failed:', error)
    return { error: 'Could not delete product. Please try again.' }
  }

  // Best-effort cleanup of the image from storage
  if (existing?.image_url) {
    const path = extractStoragePath(existing.image_url)
    if (path) {
      await supabase.storage.from('product-images').remove([path])
    }
  }

  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  return { success: true }
}
