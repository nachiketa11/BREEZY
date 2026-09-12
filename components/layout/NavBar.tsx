'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  GraduationCap,
  CalendarDays,
  User,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/attendance', icon: GraduationCap, label: 'Attendance' },
  { href: '/timeline', icon: CalendarDays, label: 'Timeline' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col gap-1 w-56 shrink-0 py-8 pl-6 pr-4">
        {/* Logo */}
        <div className="mb-8 px-2">
          <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
            Breezy
          </span>
        </div>

        <nav aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-colors duration-150 group
                  ${active
                    ? 'bg-[rgba(168,85,247,0.15)] text-[#a855f7]'
                    : 'text-[#71717a] hover:text-[#f4f4f5] hover:bg-[rgba(255,255,255,0.06)]'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center h-16 px-2
          bg-[rgba(9,9,11,0.90)] border-t border-[rgba(255,255,255,0.08)] backdrop-blur-xl"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-xs
                transition-colors duration-150
                ${active ? 'text-[#a855f7]' : 'text-[#52525b]'}
              `}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="hidden xs:block">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
