'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { toast } from 'sonner'

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

const BRANCHES = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Biotechnology', 'Physics', 'Mathematics', 'Other',
]

export default function ProfilePage() {
  const router = useRouter()
  const { profile, email, loading } = useUser()
  const [name, setName] = useState('')
  const [branch, setBranch] = useState('')
  const [semester, setSemester] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name)
      setBranch(profile.branch)
      setSemester(profile.semester)
    }
  }, [profile])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !branch || !semester) {
      toast.error('Fill in all fields')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name: name.trim(), branch, semester })

    setSaving(false)
    if (error) { toast.error('Failed to save'); return }
    toast.success('Profile updated')
  }

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545]">
        /// PROFILE
      </div>
      <div className="mt-2 pb-6 border-b border-dashed border-[rgba(255,255,255,0.14)]">
        <h1 className="text-2xl font-bold tracking-tight">{name || 'Your profile'}</h1>
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] mt-1">{email}</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 mt-6" noValidate>
        <Input
          label="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
        />

        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] uppercase tracking-widest">Branch</span>
          <div className="grid grid-cols-2 border border-[rgba(255,255,255,0.22)]">
            {BRANCHES.map(b => (
              <button
                key={b}
                type="button"
                onClick={() => setBranch(b)}
                className={`
                  px-3 py-2.5 text-left text-[13px] transition-colors
                  border-b border-r border-dashed border-[rgba(255,255,255,0.14)]
                  ${branch === b
                    ? 'bg-[#FAFAFA] text-black'
                    : 'text-[#7A7A7A] hover:text-[#FAFAFA] hover:bg-[#0D0D0D]'
                  }
                `}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] uppercase tracking-widest">Semester</span>
          <div className="grid grid-cols-8 border border-[rgba(255,255,255,0.22)]">
            {SEMESTERS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSemester(s)}
                className={`
                  py-3 font-[family-name:var(--font-dot-gothic)] text-lg transition-colors
                  border-r border-[rgba(255,255,255,0.14)] last:border-r-0
                  ${semester === s
                    ? 'bg-[#E5342B] text-black'
                    : 'text-[#7A7A7A] hover:text-[#FAFAFA] hover:bg-[#0D0D0D]'
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button variant="primary" type="submit" loading={saving} className="w-full">
          SAVE CHANGES
        </Button>
      </form>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-dashed border-[rgba(255,255,255,0.14)]">
        <div>
          <p className="text-sm text-[#FAFAFA]">Sign out</p>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] mt-0.5">BACK TO THE LANDING PAGE</p>
        </div>
        <Button variant="danger" size="sm" onClick={handleLogout} loading={loggingOut}>
          SIGN OUT
        </Button>
      </div>
    </div>
  )
}
