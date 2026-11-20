import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/product-grid'
import type { Product, Category } from '@/types/product'

export const revalidate = 30

export default async function HomePage() {
  const supabase = await createClient()

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .limit(8),
    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true }),
  ])

  const products: Product[] = productsRes.data ?? []
  const categories: Category[] = categoriesRes.data ?? []
  const loadFailed = Boolean(productsRes.error || categoriesRes.error)
  const categoryMap = new Map<string, Category>(
    categories.map((c) => [c.id, c])
  )

  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL
  const address = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS
  const hours = process.env.NEXT_PUBLIC_BUSINESS_HOURS

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-forest-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-cream-300/10 blur-3xl"
        />

        <div className="container-page relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-2xl animate-slide-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-cream-200/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-cream-100 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-cream-300" />
              Fresh daily · Prices updated live
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] text-cream-50 sm:text-5xl lg:text-6xl">
              Hand-picked fruit,
              <span className="block text-cream-200">at honest prices.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg">
              Browse our fresh selection and check today&apos;s availability
              before you visit. Everything on this page reflects our current
              stock.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="btn bg-cream-100 !text-forest-900 hover:bg-white"
              >
                Browse Catalogue
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#contact" className="btn border border-cream-100/40 !text-cream-50 hover:bg-white/10">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Featured Products ───────── */}
      <section className="container-page py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-forest-600">
              Today&apos;s Selection
            </p>
            <h2 className="mt-1 text-3xl font-semibold text-forest-950 sm:text-4xl">
              Fresh from the market
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-semibold text-forest-700 hover:text-forest-900 sm:inline-flex sm:items-center sm:gap-1"
          >
            View all
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>

        {loadFailed ? (
          <div className="card p-8 text-center">
            <p className="text-forest-700">
              We couldn&apos;t load the catalogue right now. Please refresh the
              page.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl">🍃</p>
            <p className="mt-3 text-forest-700">
              No products are listed yet. Please check back soon.
            </p>
          </div>
        ) : (
          <ProductGrid
            products={products}
            categoryMap={categoryMap}
            priorityFirstN={4}
          />
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-secondary">
            View all products
          </Link>
        </div>
      </section>

      {/* ───────── Why us ───────── */}
      <section className="border-y border-forest-100 bg-cream-100/60">
        <div className="container-page grid gap-6 py-14 sm:grid-cols-3 sm:py-20">
          {[
            {
              icon: '🌿',
              title: 'Fresh daily',
              text: 'Hand-picked fruit arrives every morning. If it\u2019s not fresh, it\u2019s not FAWAKIH.',
            },
            {
              icon: '💵',
              title: 'Honest pricing',
              text: 'Real prices in Malaysian Ringgit, updated as the market moves — no surprises.',
            },
            {
              icon: '⚡',
              title: 'Live availability',
              text: 'What you see is what we have. Check stock before you visit.',
            },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <span className="text-3xl" aria-hidden="true">
                {item.icon}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-forest-950">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest-700">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Contact ───────── */}
      <section id="contact" className="container-page scroll-mt-20 py-14 sm:py-20">
        <div className="card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-5">
            <div className="bg-forest-900 p-8 text-cream-100 sm:p-10 lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-forest-300">
                Get in touch
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-cream-50 sm:text-4xl">
                Visit us today
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-cream-100/80">
                Questions about stock, prices, or a custom order? Reach out —
                we reply the same day.
              </p>
            </div>

            <div className="grid gap-6 p-8 sm:grid-cols-2 sm:p-10 lg:col-span-3">
              {phone && (
                <ContactItem label="Phone" icon="📞">
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="text-forest-800 hover:underline"
                  >
                    {phone}
                  </a>
                </ContactItem>
              )}
              {email && (
                <ContactItem label="Email" icon="✉️">
                  <a
                    href={`mailto:${email}`}
                    className="break-all text-forest-800 hover:underline"
                  >
                    {email}
                  </a>
                </ContactItem>
              )}
              {address && (
                <ContactItem label="Visit" icon="📍">
                  {address}
                </ContactItem>
              )}
              {hours && (
                <ContactItem label="Open" icon="🕒">
                  {hours}
                </ContactItem>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ContactItem({
  label,
  icon,
  children,
}: {
  label: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest-500">
        <span aria-hidden="true">{icon}</span>
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-forest-800">
        {children}
      </p>
    </div>
  )
}
