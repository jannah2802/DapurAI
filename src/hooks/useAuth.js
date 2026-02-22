import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const GUEST_KEY = 'dapur-ai-guest-mode'

const guestUser = {
  id: 'guest-local-user',
  email: 'guest@offline.local',
  user_metadata: { name: 'Guest Chef' },
}

export function useAuth() {
  const [session, setSession] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const storedGuest = localStorage.getItem(GUEST_KEY) === 'true'
    if (storedGuest) {
      setIsGuest(true)
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return

      if (data.session) {
        localStorage.removeItem(GUEST_KEY)
        setIsGuest(false)
      }

      setSession(data.session ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession) {
        localStorage.removeItem(GUEST_KEY)
        setIsGuest(false)
      }
      setSession(newSession ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const continueAsGuest = () => {
    localStorage.setItem(GUEST_KEY, 'true')
    setIsGuest(true)
    setSession(null)
  }

  const logout = async () => {
    if (isGuest) {
      localStorage.removeItem(GUEST_KEY)
      setIsGuest(false)
      return
    }

    await supabase.auth.signOut()
  }

  return {
    session,
    user: session?.user ?? (isGuest ? guestUser : null),
    isGuest,
    loading,
    continueAsGuest,
    logout,
  }
}
