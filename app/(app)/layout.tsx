import { NavBar } from '@/components/layout/NavBar'
import { PageTransition } from '@/components/layout/PageTransition'
import type { ReactNode } from 'react'

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh pb-16 md:pb-0">
      <NavBar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <PageTransition>
          <div className="h-full overflow-y-auto px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
