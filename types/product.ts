import type { Database, ProductStatus } from './database'

export type Product = Database['public']['Tables']['products']['Row']
export type Category = Database['public']['Tables']['categories']['Row']

export type ProductWithCategory = Product & {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
}

export interface ProductFormInput {
  name: string
  description: string
  price: string
  category_id: string
  status: ProductStatus
  display_order: string
  is_published: boolean
  image_url: string | null
}

export type { ProductStatus }
