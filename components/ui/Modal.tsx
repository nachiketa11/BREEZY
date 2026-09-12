'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative bg-[#0D0D0D] border border-[rgba(255,255,255,0.22)] rounded-none w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-dashed border-[rgba(255,255,255,0.14)] pb-4">
          <h2
            id="modal-title"
            className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#7A7A7A] uppercase tracking-widest"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#7A7A7A] hover:text-[#FAFAFA] border border-[rgba(255,255,255,0.14)] px-2 py-1 transition-colors"
            aria-label="Close modal"
          >
            [X]
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
