'use client'

import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pendingText?: string
}

export default function SubmitButton({
  children,
  pendingText = 'Please wait…',
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      aria-busy={pending}
      className={cn('btn-primary', className)}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  )
}
