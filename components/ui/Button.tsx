'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[#E5342B] border-[#E5342B] text-black hover:bg-[#ff473d] hover:border-[#ff473d]',
  secondary:
    'bg-transparent text-[#FAFAFA] border-[rgba(255,255,255,0.22)] hover:bg-[#151515]',
  ghost:
    'bg-transparent border-transparent text-[#7A7A7A] hover:text-[#FAFAFA] hover:bg-[#151515]',
  danger:
    'bg-transparent text-[#E5342B] border-[rgba(229,52,43,0.5)] hover:bg-[rgba(229,52,43,0.14)]',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-5 py-3 text-[13px]',
  lg: 'px-6 py-3.5 text-[13px]',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-none
        font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-wide
        border transition-colors duration-150 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
