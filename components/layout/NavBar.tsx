'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'DASHBOARD', idx: '01' },
  { href: '/tasks', label: 'TASKS', idx: '02' },
  { href: '/attendance', label: 'ATTENDANCE', idx: '03' },
  { href: '/timeline', label: 'TIMELINE', idx: '04' },
  { href: '/profile', label: 'PROFILE', idx: '05' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar — spec sheet style */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-dashed border-[rgba(255,255,255,0.14)] min-h-dvh sticky top-0">
        <div className="px-6 py-6 border-b border-dashed border-[rgba(255,255,255,0.14)] flex items-center gap-2.5">
          <div className="w-2 h-2 bg-[#E5342B] rounded-full shrink-0" />
          <span className="text-[16px] font-semibold tracking-wide">BREEZY</span>
        </div>

        <nav aria-label="Main navigation" className="flex-1 py-2">
          {NAV_ITEMS.map(({ href, label, idx }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`
                  flex items-center justify-between px-6 py-3.5
                  font-[family-name:var(--font-jetbrains-mono)] text-[12px] tracking-widest
                  border-l-2 transition-colors
                  ${active
                    ? 'border-[#E5342B] text-[#FAFAFA] bg-[rgba(229,52,43,0.06)]'
                    : 'border-transparent text-[#7A7A7A] hover:text-[#FAFAFA] hover:bg-[#0D0D0D]'
                  }
                `}
              >
                <span>{active ? `> ${label}` : `  ${label}`}</span>
                <span className="text-[#454545] text-[11px]">{idx}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-6 py-5 border-t border-dashed border-[rgba(255,255,255,0.14)] font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] flex items-center gap-2">
          <div className="nos-pulse" />
          SYSTEM ONLINE
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black border-b border-dashed border-[rgba(255,255,255,0.14)]">
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#E5342B] rounded-full" />
            <span className="text-sm font-semibold tracking-wide">BREEZY</span>
          </div>
          <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[#7A7A7A]">
            <div className="nos-pulse" />
            ONLINE
          </div>
        </div>
        <nav className="flex overflow-x-auto border-t border-dashed border-[rgba(255,255,255,0.14)]" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ href, label }) => {
            const short = label.slice(0, 4)
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`
                  flex-1 text-center px-2 py-3 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-widest whitespace-nowrap
                  ${active ? 'text-[#E5342B] border-b border-[#E5342B]' : 'text-[#7A7A7A]'}
                `}
              >
                {short}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile bottom spacer handled by layout padding */}
    </>
  )
}
