'use client'

import { Suspense, lazy } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckSquare, GraduationCap, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Lazy-load the R3F scene so it doesn't block first paint
const HeroScene = lazy(() => import('@/components/three/HeroScene'))

const features = [
  {
    icon: CheckSquare,
    title: 'Tasks at a glance',
    description: 'See what\'s due today — no digging through five apps.',
  },
  {
    icon: GraduationCap,
    title: 'Attendance risk',
    description: '"Two classes away from 75%" — not just a bare number.',
  },
  {
    icon: CalendarDays,
    title: 'Unified timeline',
    description: 'Tasks and events, merged into one daily view.',
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#09090b]">
      {/* R3F Canvas — behind everything */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Gradient overlay to ensure text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[rgba(9,9,11,0.4)] to-[#09090b]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-dvh">
        {/* Nav */}
        <header className="flex items-center justify-between px-6 md:px-12 py-6">
          <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
            Breezy
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </header>

        {/* Hero section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.08)] text-[#a855f7] text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse" />
              Built for university students
            </div>

            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-6xl font-bold text-[#f4f4f5] leading-[1.1] tracking-tight">
              Your semester,
              <br />
              <span className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
                in 15 seconds
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-[#71717a] max-w-md mx-auto leading-relaxed">
              Tasks, attendance risk, and your daily schedule — one dashboard
              instead of five separate apps.
            </p>

            <div className="flex items-center justify-center gap-3 mt-8">
              <Link href="/signup">
                <Button size="lg">
                  Get started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Sign in
                </Button>
              </Link>
            </div>
          </motion.div>
        </main>

        {/* Feature cards */}
        <section className="px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="glass p-5 flex flex-col gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-[rgba(168,85,247,0.12)] flex items-center justify-center">
                  <f.icon className="w-4.5 h-4.5 text-[#a855f7]" />
                </div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[#f4f4f5]">
                  {f.title}
                </h3>
                <p className="text-xs text-[#71717a] leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
