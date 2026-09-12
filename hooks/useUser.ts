'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

interface UserState {
  id: string | null
  email: string | null
  profile: Profile | null
  loading: boolean
}

export function useUser() {
  const [state, setState] = useState<UserState>({
    id: null,
    email: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setState({ id: null, email: null, profile: null, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setState({
        id: user.id,
        email: user.email ?? null,
        profile: profile ?? null,
        loading: false,
      })
    }

    load()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      load()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return state
}
