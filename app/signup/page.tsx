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

    toast.success('Account created')
    router.push('/onboarding')
    router.refresh()
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-5 bg-black">
      <div className="w-full max-w-sm border border-[rgba(255,255,255,0.22)] bg-[#0D0D0D]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-[rgba(255,255,255,0.14)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#E5342B] rounded-full" />
            <span className="text-sm font-semibold tracking-wide">BREEZY</span>
          </div>
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545]">NEW ACCOUNT</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5" noValidate>
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
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#E5342B] border border-[rgba(229,52,43,0.5)] bg-[rgba(229,52,43,0.14)] px-3 py-2">
              {error.toUpperCase()}
            </p>
          )}

          <Button variant="primary" type="submit" loading={loading} className="w-full">
            CREATE ACCOUNT →
          </Button>
        </form>

        <div className="px-6 py-4 border-t border-dashed border-[rgba(255,255,255,0.14)] text-center font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A]">
          HAVE AN ACCOUNT?{' '}
          <Link href="/login" className="text-[#FAFAFA] underline underline-offset-4 hover:text-[#E5342B]">
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  )
}
