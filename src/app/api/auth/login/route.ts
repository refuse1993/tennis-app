import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Session } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { session }: { session: Session } = await request.json()
    
    if (!session?.access_token || !session?.refresh_token) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data, error } = await supabase.auth.setSession(session)
    
    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      user: data.user
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}