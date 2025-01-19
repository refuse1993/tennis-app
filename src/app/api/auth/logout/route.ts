import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Supabase 세션 제거
    await supabase.auth.signOut()

    // 모든 쿠키 제거
    const response = NextResponse.json({ success: true })
    
    // Supabase 관련 쿠키 제거
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    
    return response
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}