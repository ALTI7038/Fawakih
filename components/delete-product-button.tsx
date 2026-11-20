'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { deleteProductAction } from '@/lib/actions/products'

export default function DeleteProductButton({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    const confirmed = window.confirm(
      `Delete "${name}"?\n\nThis cannot be undone.`
    )
    if (!confirmed) return

    startTransition(async () => {
      const result = await deleteProductAction(id)
      if (result.error) {
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? 'Deleting…' : 'Delete'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}
