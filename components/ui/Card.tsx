'use client'

import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  label?: string
  index?: string
  onClick?: () => void
}

export function Card({ children, className = '', label, index, onClick }: CardProps) {
  return (
    <div
      className={`bg-[#0D0D0D] border-t border-dashed border-[rgba(255,255,255,0.14)] rounded-none p-6 ${onClick ? 'cursor-pointer hover:bg-[#111]' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
    >
      {(label || index) && (
        <div className="flex justify-between items-center mb-5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] uppercase tracking-wide">
          <span>{label}</span>
          {index && <span className="text-[#454545]">{index}</span>}
        </div>
      )}
      {children}
    </div>
  )
}
