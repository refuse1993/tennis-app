'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentMatches from '@/components/dashboard/RecentMatches'
import QuickActions from '@/components/dashboard/QuickActions'

export default function DashboardPage() {
  const [userStats, setUserStats] = useState({
    currentRank: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    rankTrend: { value: 2, isUpward: true }, // 예시 데이터
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // TODO: 실제 데이터 로딩 로직 구현
        // 임시 데이터
        setUserStats({
          currentRank: 5,
          wins: 10,
          losses: 5,
          winRate: 66.7,
          rankTrend: { value: 2, isUpward: true },
        })
      } catch (error) {
        console.error('대시보드 데이터 로딩 에러:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">대시보드</h1>
      
      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="현재 랭킹" 
          value={`${userStats.currentRank}위`} 
          icon="🏆"
          trend={userStats.rankTrend}
        />
        <StatsCard 
          title="승리" 
          value={userStats.wins} 
          icon="✅"
        />
        <StatsCard 
          title="패배" 
          value={userStats.losses} 
          icon="❌"
        />
        <StatsCard 
          title="승률" 
          value={`${userStats.winRate}%`} 
          icon="📊"
        />
      </div>

    {/* 퀵 액션 */}
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">빠른 작업</h2>
      <QuickActions />
    </div>  
    
    {/* 최근 매치 */}
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">최근 매치</h2>
        <button
          onClick={() => window.location.href = '/matches'}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          전체 보기
        </button>
      </div>
      <RecentMatches />
    </div>
    </div>
  )
}