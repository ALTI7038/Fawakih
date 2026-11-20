import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="card w-full max-w-md p-8">
        <p className="text-4xl" aria-hidden="true">
          🍃
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-forest-950">
          Page not found
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-forest-700">
          This page doesn&apos;t exist, or the product has been removed.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            Home
          </Link>
          <Link href="/products" className="btn-secondary">
            Browse products
          </Link>
        </div>
      </div>
    </div>
  )
}
