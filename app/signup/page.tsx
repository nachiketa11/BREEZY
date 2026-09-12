'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    toast.success('Account created — let\'s set up your profile')
    router.push('/onboarding')
    router.refresh()
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-[#09090b]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="glass w-full max-w-sm p-8 flex flex-col gap-6 relative z-10">
        <div className="text-center">
          <span className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
            Breezy
          </span>
          <p className="mt-2 text-sm text-[#a1a1aa]">Create your student account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="University email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Same as above"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />

          {error && (
            <p className="text-sm text-[#ef4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full mt-1">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-[#71717a]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#a855f7] hover:text-[#c084fc] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
