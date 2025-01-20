// app/api/auth/logout/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Supabase 클라이언트 생성
    const supabase = createRouteHandlerClient({ 
      cookies
    })
    
    // 로그아웃 실행
    await supabase.auth.signOut()

    // 응답 생성
    const response = NextResponse.json({ success: true })
    
    // 기본 Supabase 쿠키 삭제
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    
    return response
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}