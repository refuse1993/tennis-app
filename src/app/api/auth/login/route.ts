import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { session } = await request.json()
    
    // 쿠키에 세션 정보 저장
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    await supabase.auth.setSession(session)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}