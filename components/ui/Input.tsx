import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] uppercase tracking-widest">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-3 rounded-none text-sm text-[#FAFAFA]
          bg-black border border-[rgba(255,255,255,0.22)]
          placeholder:text-[#454545]
          focus:outline-none focus:border-[#E5342B]
          transition-colors duration-150
          ${error ? 'border-[#E5342B]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#E5342B]">{error}</p>}
    </div>
  )
}
