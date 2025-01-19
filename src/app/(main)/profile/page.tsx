'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import RecentMatches from "@/components/dashboard/RecentMatches"

interface Player {
  id: string
  name: string
  rating: number
  matches_played: number
  wins: number
  losses: number
  created_at: string
}

export default function PlayerProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // 현재 로그인된 사용자의 세션 확인
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (!session?.user) {
          router.push('/login')
          return
        }

        // 사용자 ID로 players 테이블에서 데이터 조회
        const { data: playerData, error: playerError } = await supabase
          .from('players')
          .select('*')
          .eq('id', session.user.id)  // auth.users의 id와 매칭되는 필드명으로 수정
          .single()

        if (playerError) {
          // 플레이어 데이터가 없는 경우 새로 생성
          if (playerError.code === 'PGRST116') {
            const { data: newPlayer, error: createError } = await supabase
              .from('players')
              .insert([
                {
                  user_id: session.user.id,
                  name: session.user.email?.split('@')[0] || 'Unknown',
                  rating: 1500,  // 초기 레이팅
                  matches_played: 0,
                  wins: 0,
                  losses: 0
                }
              ])
              .select()
              .single()

            if (createError) throw createError
            setPlayer(newPlayer)
          } else {
            throw playerError
          }
        } else {
          setPlayer(playerData)
        }
      } catch (error) {
        console.error('플레이어 데이터 로딩 에러:', error)
        setError('플레이어 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayerData()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600 dark:text-red-400">
        {error}
      </div>
    )
  }

  const winRate = player && player.matches_played > 0 
    ? ((player.wins / player.matches_played) * 100).toFixed(1) 
    : '0.0'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 프로필 헤더 */}
      <Card className="mb-6">
        <div className="flex items-center p-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold mr-6">
            {player?.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{player?.name}</h1>
            <p className="text-sm text-gray-500">
              가입일: {player?.created_at && format(new Date(player.created_at), 'PPP', { locale: ko })}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{player?.rating}</div>
            <div className="text-sm text-gray-500">레이팅</div>
          </div>
        </div>
      </Card>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="matches">매치 기록</TabsTrigger>
          <TabsTrigger value="stats">상세 통계</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="승/패" 
              value={`${player?.wins}승 ${player?.losses}패`}
              subValue={`승률 ${winRate}%`}
            />
            <StatCard 
              title="레이팅" 
              value={player?.rating ?? 0}
              subValue="현재 레이팅"
            />
            <StatCard 
              title="총 경기" 
              value={player?.matches_played ?? 0}
              subValue="매치 수"
            />
          </div>
        </TabsContent>

        <TabsContent value="matches">
          <RecentMatches playerId={player?.id} />
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">매치 통계</h3>
              {/* 여기에 매치 통계 추가 */}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  subValue 
}: { 
  title: string
  value: string | number
  subValue: string 
}) {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-500">{subValue}</div>
    </Card>
  )
}