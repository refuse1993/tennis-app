'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { AuthState, UserProfile } from '@/types/auth'

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  })

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setState({ user: null, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from('players')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setState({
          user: {
            id: profile.id,
            email: session.user.email!,
            name: profile.name,
            experience: profile.experience,
            title: profile.title,
          },
          loading: false,
        })
      }
    } catch (error) {
      console.error('Error loading user:', error)
      setState({ user: null, loading: false })
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setState({ user: null, loading: false })
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    refreshUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await refreshUser()
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, loading: false })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}