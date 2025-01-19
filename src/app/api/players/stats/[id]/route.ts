import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // 플레이어 기본 정보 조회
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('id', params.id)
      .single()

    if (playerError) throw playerError

    // 승률, 평균 점수 등 추가 통계 계산
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .or(`player1_id.eq.${params.id},player2_id.eq.${params.id}`)

    if (matchesError) throw matchesError

    // 통계 계산 로직...

    return NextResponse.json({
      player,
      matches,
      // 추가 통계...
    })

  } catch (error) {
    console.error('Error fetching player stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player statistics' },
      { status: 500 }
    )
  }
}