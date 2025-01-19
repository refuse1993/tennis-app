import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: player, error } = await supabase
      .from('players')
      .select('id, auth_id, name, rating, matches_played, wins, losses')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('플레이어 조회 에러:', error)
      return NextResponse.json(
        { error: '플레이어 조회 실패' },
        { status: 500 }
      )
    }

    return NextResponse.json(player)

  } catch (error) {
    console.error('서버 에러:', error)
    return NextResponse.json(
      { error: '서버 에러' },
      { status: 500 }
    )
  }
}