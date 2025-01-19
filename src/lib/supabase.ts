import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'tennis-app-auth',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
})

// 세션 클리어 헬퍼 함수
export const clearSupabaseData = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('tennis-app-auth')
    window.localStorage.removeItem('supabase.auth.token')
    // 다른 Supabase 관련 데이터도 제거
    Object.keys(window.localStorage).forEach(key => {
      if (key.startsWith('supabase.') || key.startsWith('sb-')) {
        window.localStorage.removeItem(key)
      }
    })
  }
}