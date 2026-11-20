'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signInAction, type SignInState } from '@/lib/actions/auth'

const initialState: SignInState = {}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, initialState)

  return (
    <>
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight text-forest-900"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          FAWAKIH
        </Link>
        <p className="mt-1 text-sm text-forest-600">Administrator sign in</p>
      </div>

      <form action={formAction} className="card space-y-5 p-6 sm:p-8" noValidate>
        {state.error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="input"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="input"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="btn-primary w-full"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-forest-500">
        Only authorized administrators can sign in.
        <br />
        Contact the business owner if you need access.
      </p>
    </>
  )
}
