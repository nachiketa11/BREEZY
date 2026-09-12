'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

type Step = 1 | 2 | 3

const BRANCHES = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Biotechnology', 'Physics', 'Mathematics', 'Other',
]

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [branch, setBranch] = useState('')
  const [semester, setSemester] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  function next() {
    setError('')
    if (step === 1 && !name.trim()) { setError('Please enter your name'); return }
    if (step === 2 && !branch) { setError('Please select your branch'); return }
    if (step === 3 && !semester) { setError('Please select your semester'); return }
    if (step < 3) setStep((s) => (s + 1) as Step)
  }

  async function submit() {
    if (!semester) { setError('Please select your semester'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name: name.trim(), branch, semester })

    setLoading(false)
    if (dbError) {
      setError(dbError.message)
      toast.error('Failed to save profile')
      return
    }

    toast.success('Profile saved — welcome to Breezy!')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-[#09090b]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(168,85,247,0.08)_0%,transparent_60%)] pointer-events-none" />

      <div className="glass w-full max-w-md p-8 flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div>
          <span className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
            Breezy
          </span>
          <p className="mt-1 text-sm text-[#a1a1aa]">Step {step} of {totalSteps}</p>

          {/* Progress bar */}
          <div className="mt-3 h-1 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#22d3ee]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[160px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-4"
              >
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[#f4f4f5]">
                  What should we call you?
                </h2>
                <p className="text-sm text-[#71717a]">Your name appears in your dashboard greeting.</p>
                <Input
                  label="Full name"
                  type="text"
                  placeholder="Priya Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') next() }}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-4"
              >
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[#f4f4f5]">
                  What&apos;s your branch?
                </h2>
                <p className="text-sm text-[#71717a]">Used to organise your tasks and subjects.</p>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {BRANCHES.map(b => (
                    <button
                      key={b}
                      onClick={() => setBranch(b)}
                      className={`
                        px-3 py-2 rounded-xl text-sm text-left transition-colors
                        ${branch === b
                          ? 'bg-[rgba(168,85,247,0.2)] border border-[rgba(168,85,247,0.4)] text-[#a855f7]'
                          : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] hover:border-[rgba(168,85,247,0.3)]'
                        }
                      `}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-4"
              >
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[#f4f4f5]">
                  Which semester are you in?
                </h2>
                <p className="text-sm text-[#71717a]">Helps surface the most relevant info for you.</p>
                <div className="grid grid-cols-4 gap-2">
                  {SEMESTERS.map(s => (
                    <button
                      key={s}
                      onClick={() => setSemester(s)}
                      className={`
                        aspect-square rounded-xl text-sm font-semibold transition-colors
                        ${semester === s
                          ? 'bg-[rgba(168,85,247,0.2)] border border-[rgba(168,85,247,0.4)] text-[#a855f7]'
                          : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] hover:border-[rgba(168,85,247,0.3)]'
                        }
                      `}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <p className="text-sm text-[#ef4444] -mt-4">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(s => (s - 1) as Step)}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          ) : <div />}

          {step < 3 ? (
            <Button onClick={next}>
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={submit} loading={loading}>
              <CheckCircle className="w-4 h-4" /> Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
