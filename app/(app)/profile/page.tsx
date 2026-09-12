'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { toast } from 'sonner'
import { LogOut, User } from 'lucide-react'

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
      toast.error('Please fill in all fields')
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
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f4f4f5]">
          Profile
        </h1>
        <p className="text-sm text-[#71717a] mt-1">{email}</p>
      </div>

      {/* Edit form */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-[rgba(168,85,247,0.15)] flex items-center justify-center">
            <User className="w-4 h-4 text-[#a855f7]" />
          </div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[#f4f4f5]">
            Your details
          </h2>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5" noValidate>
          <Input
            label="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Priya Sharma"
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-[#a1a1aa] font-medium">Branch</span>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {BRANCHES.map(b => (
                <button
                  key={b}
                  type="button"
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
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-[#a1a1aa] font-medium">Semester</span>
            <div className="grid grid-cols-8 gap-2">
              {SEMESTERS.map(s => (
                <button
                  key={s}
                  type="button"
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
          </div>

          <Button type="submit" loading={saving} className="w-full mt-1">
            Save changes
          </Button>
        </form>
      </Card>

      {/* Logout */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#f4f4f5]">Sign out</p>
            <p className="text-xs text-[#71717a] mt-0.5">You&apos;ll be redirected to the landing page</p>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout} loading={loggingOut}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </Card>
    </div>
  )
}
