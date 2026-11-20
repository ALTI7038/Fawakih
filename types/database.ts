export type ProductStatus = 'available' | 'limited' | 'out_of_stock'

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          display_order?: number
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category_id: string | null
          status: ProductStatus
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category_id?: string | null
          status?: ProductStatus
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category_id?: string | null
          status?: ProductStatus
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      product_status: ProductStatus
    }
    CompositeTypes: Record<string, never>
  }
}
