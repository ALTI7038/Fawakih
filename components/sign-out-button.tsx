'use client'

import { signOutAction } from '@/lib/actions/auth'

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-lg border border-cream-100/20 px-3 py-1.5 text-xs font-medium text-cream-100/70 transition-colors hover:border-cream-100/40 hover:text-cream-50"
      >
        Sign out
      </button>
    </form>
  )
}
