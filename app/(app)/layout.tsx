import { NavBar } from '@/components/layout/NavBar'
import { PageTransition } from '@/components/layout/PageTransition'
import type { ReactNode } from 'react'

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-black">
      <NavBar />
      <main className="flex-1 flex flex-col min-w-0">
        <PageTransition>
          {/* mobile top bar offset */}
          <div className="pt-[104px] md:pt-0">
            <div className="nos-wrap py-0">
              <div className="py-6 md:py-8">{children}</div>
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
