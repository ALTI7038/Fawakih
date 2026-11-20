'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface SignInState {
  error?: string
}

export async function signInAction(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || !email.trim()) {
    return { error: 'Please enter your email address.' }
  }
  if (typeof password !== 'string' || password.length < 1) {
    return { error: 'Please enter your password.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error || !data.user) {
    // Generic message — never leak whether the email exists
    return { error: 'Invalid email or password.' }
  }

  if (data.user.app_metadata?.role !== 'admin') {
    // Authenticated, but not an administrator — revoke session immediately
    await supabase.auth.signOut()
    return { error: 'Access denied. This account is not an administrator.' }
  }

  redirect('/admin')
}

export async function signOutAction(_formData?: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
