import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-[#a1a1aa] font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2.5 rounded-xl text-sm text-[#f4f4f5]
          bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)]
          placeholder:text-[#52525b]
          focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7]
          transition-colors duration-150
          ${error ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  )
}
