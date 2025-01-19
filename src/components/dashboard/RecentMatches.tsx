'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Player {
  id: string
  name: string
}

interface Match {
  id: string
  match_date: string
  team_a_player1: Player
  team_a_player2: Player
  team_b_player1: Player
  team_b_player2: Player
  team_a_sets: string[]
  team_b_sets: string[]
  winner_team: 'A' | 'B'
}

export default function RecentMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRecentMatches = async () => {
      try {
        const { data: matchesData, error: matchesError } = await supabase
            .from('matches')
            .select(`
                id,
                match_date,
                team_a_sets,
                team_b_sets,
                winner_team,
                team_a_player1:players!team_a_player1_id(id, name),
                team_a_player2:players!team_a_player2_id(id, name),
                team_b_player1:players!team_b_player1_id(id, name),
                team_b_player2:players!team_b_player2_id(id, name)
            `)
            .order('match_date', { ascending: false })
            .limit(5)

        if (matchesError) throw matchesError
        
        setMatches(matchesData)
      } catch (error) {
        console.error('최근 매치 로딩 에러:', error)
        setError('매치 기록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadRecentMatches()
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        {error}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">아직 기록된 매치가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col space-y-3">
            {/* 매치 날짜 */}
            <div className="text-sm text-gray-500">
              {new Date(match.match_date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            {/* 팀 정보 및 스코어 */}
            <div className="flex justify-between items-center">
              {/* 팀 A */}
              <div className={`flex-1 ${match.winner_team === 'A' ? 'font-semibold' : ''}`}>
                <div>{match.team_a_player1.name}</div>
                <div>{match.team_a_player2.name}</div>
              </div>

              {/* 스코어 */}
              <div className="flex-1 text-center">
                {match.team_a_sets.map((score, idx) => (
                  <span key={idx} className="mx-1">
                    {score}-{match.team_b_sets[idx]}
                  </span>
                ))}
              </div>

              {/* 팀 B */}
              <div className={`flex-1 text-right ${match.winner_team === 'B' ? 'font-semibold' : ''}`}>
                <div>{match.team_b_player1.name}</div>
                <div>{match.team_b_player2.name}</div>
              </div>
            </div>

            {/* 승자 표시 */}
            <div className={`text-sm ${match.winner_team === 'A' ? 'text-blue-600' : 'text-red-600'} text-center`}>
              {match.winner_team === 'A' ? '팀 A 승리' : '팀 B 승리'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}