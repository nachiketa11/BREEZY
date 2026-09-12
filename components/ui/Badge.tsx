import type { ReactNode } from 'react'

type BadgeVariant = 'red' | 'amber' | 'neutral' | 'safe'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  red: 'text-[#E5342B] border-[rgba(229,52,43,0.5)] bg-[rgba(229,52,43,0.14)]',
  amber: 'text-[#FAFAFA] border-[rgba(255,255,255,0.22)] bg-transparent',
  neutral: 'text-[#7A7A7A] border-[rgba(255,255,255,0.14)] bg-transparent',
  safe: 'text-[#FAFAFA] border-[#FAFAFA] bg-transparent',
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-none
        font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-wide border
        ${variantStyles[variant]} ${className}
      `}
    >
      {children}
    </span>
  )
}
