'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

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

  function next() {
    setError('')
    if (step === 1 && !name.trim()) { setError('ENTER YOUR NAME'); return }
    if (step === 2 && !branch) { setError('PICK YOUR BRANCH'); return }
    if (step === 3 && !semester) { setError('PICK YOUR SEMESTER'); return }
    if (step < 3) setStep((s) => (s + 1) as Step)
  }

  async function submit() {
    if (!semester) { setError('PICK YOUR SEMESTER'); return }
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
      setError(dbError.message.toUpperCase())
      toast.error('Failed to save profile')
      return
    }

    toast.success('Welcome to Breezy')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-5 bg-black">
      <div className="w-full max-w-md border border-[rgba(255,255,255,0.22)] bg-[#0D0D0D]">
        <div className="px-6 py-4 border-b border-dashed border-[rgba(255,255,255,0.14)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#E5342B] rounded-full" />
              <span className="text-sm font-semibold tracking-wide">BREEZY</span>
            </div>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545]">
              STEP {step}/{totalSteps}
            </span>
          </div>
          <div className="mt-3 h-px bg-[rgba(255,255,255,0.14)] relative">
            <div
              className="absolute left-0 top-0 h-px bg-[#E5342B] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 min-h-[280px] flex flex-col gap-4">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold tracking-tight">What should we call you?</h2>
              <p className="text-[13px] text-[#7A7A7A]">Shows up in your dashboard header. Nothing else.</p>
              <Input
                label="Full name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') next() }}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold tracking-tight">Branch?</h2>
              <p className="text-[13px] text-[#7A7A7A]">Used to label your dashboard footer. That&apos;s it.</p>
              <div className="grid grid-cols-2 border border-[rgba(255,255,255,0.22)]">
                {BRANCHES.map(b => (
                  <button
                    key={b}
                    onClick={() => setBranch(b)}
                    className={`
                      px-3 py-2.5 text-left text-[13px] transition-colors
                      border-b border-r border-dashed border-[rgba(255,255,255,0.14)]
                      ${branch === b
                        ? 'bg-[#FAFAFA] text-black'
                        : 'text-[#7A7A7A] hover:text-[#FAFAFA] hover:bg-[#151515]'
                      }
                    `}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold tracking-tight">Semester?</h2>
              <p className="text-[13px] text-[#7A7A7A]">One tap. Done.</p>
              <div className="grid grid-cols-8 border border-[rgba(255,255,255,0.22)]">
                {SEMESTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSemester(s)}
                    className={`
                      py-3 font-[family-name:var(--font-dot-gothic)] text-lg transition-colors
                      border-r border-[rgba(255,255,255,0.14)] last:border-r-0
                      ${semester === s
                        ? 'bg-[#E5342B] text-black'
                        : 'text-[#7A7A7A] hover:text-[#FAFAFA] hover:bg-[#151515]'
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {error && (
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#E5342B]">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-dashed border-[rgba(255,255,255,0.14)]">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(s => (s - 1) as Step)}>
              ← BACK
            </Button>
          ) : <div />}

          {step < 3 ? (
            <Button variant="secondary" onClick={next}>
              CONTINUE →
            </Button>
          ) : (
            <Button variant="primary" onClick={submit} loading={loading}>
              GO TO DASHBOARD →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
