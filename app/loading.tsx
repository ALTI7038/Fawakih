export default function Loading() {
  return (
    <div className="container-page py-16" aria-busy="true" aria-label="Loading">
      <div className="mb-10 h-8 w-48 animate-pulse rounded-lg bg-forest-100" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-forest-100 bg-white"
          >
            <div className="aspect-square animate-pulse bg-forest-100" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-forest-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-forest-100" />
              <div className="h-3 w-full animate-pulse rounded bg-forest-100" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-forest-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
