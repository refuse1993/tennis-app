'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Player {
  name: string
}

interface Match {
  id: string
  created_at: string
  winner_team: 'A' | 'B'
  team_a_player1: Player
  team_a_player2: Player
  team_b_player1: Player
  team_b_player2: Player
  team_a_sets: number
  team_b_sets: number
}

export default function RecentMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches/recent')
      .then(res => res.json())
      .then(data => {
        // 응답 데이터 확인
        console.log('API 응답:', data)
        // data가 배열인지 확인하고 설정
        setMatches(Array.isArray(data) ? data : [])
        setIsLoading(false)
      })
      .catch(error => {
        console.error('매치 로딩 에러:', error)
        setIsLoading(false)
      })
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

  if (!Array.isArray(matches) || matches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        아직 매치 기록이 없습니다.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {matches.map(match => (
        <div 
          key={match.id} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all p-2.5"
        >
          {/* 날짜와 승패 */}
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-gray-500">
              {format(new Date(match.created_at), 'M.d HH:mm')}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              match.winner_team === 'A' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {match.winner_team === 'A' ? '승' : '패'}
            </span>
          </div>

          {/* 스코어 */}
          <div className="flex justify-center items-center my-1.5">
            <div className={`text-lg font-bold ${
              match.winner_team === 'A' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {match.team_a_sets}
            </div>
            <div className="text-sm mx-1.5 text-gray-400">:</div>
            <div className={`text-lg font-bold ${
              match.winner_team === 'B' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {match.team_b_sets}
            </div>
          </div>

          {/* 팀 정보 */}
          <div className="text-center text-[11px] leading-tight">
            <div className="text-gray-900 dark:text-white">
              {match.team_a_player1.name.split(' ')[0]}, {match.team_a_player2.name.split(' ')[0]}
            </div>
            <div className="text-[10px] text-gray-400 my-0.5">vs</div>
            <div className="text-gray-900 dark:text-white">
              {match.team_b_player1.name.split(' ')[0]}, {match.team_b_player2.name.split(' ')[0]}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}