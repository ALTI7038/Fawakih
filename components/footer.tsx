import Link from 'next/link'

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL
  const address = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-forest-800 bg-forest-950 text-cream-100">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-cream-50">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </span>
            <span
              className="text-lg font-semibold tracking-tight text-cream-50"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              FAWAKIH
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-100/70">
            Fresh, hand-picked fruit at honest daily prices. Browse our
            selection and check today&apos;s availability anytime.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-forest-300">
            Explore
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-cream-100/80 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-cream-100/80 hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="text-cream-100/80 hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-cream-100/80 hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-forest-300">
            Reach us
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-cream-100/80">
            {phone && (
              <li>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="hover:text-white"
                >
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="break-all hover:text-white">
                  {email}
                </a>
              </li>
            )}
            {address && <li className="leading-relaxed">{address}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-forest-800/60">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream-100/60 sm:flex-row">
          <p>© {year} FAWAKIH. All rights reserved.</p>
          <p>Prices in Malaysian Ringgit (RM)</p>
        </div>
      </div>
    </footer>
  )
}
