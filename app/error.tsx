'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Root error boundary:', error)
  }, [error])

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="card w-full max-w-md p-8">
        <p className="text-4xl" aria-hidden="true">
          🍂
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-forest-950">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-forest-700">
          We couldn&apos;t load this page. Please try again — if it keeps
          happening, contact us directly.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-forest-500">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <a href="/" className="btn-secondary">
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
