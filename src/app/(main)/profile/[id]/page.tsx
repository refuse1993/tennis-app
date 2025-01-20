'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import RecentMatches from "@/components/dashboard/RecentMatches";
import PartnerCard from '@/components/profile/[id]/PartnerCard';


interface Player {
  id: string;
  name: string;
  avatar_url: string | null;
  rating: number;
  matches_played: number;
  wins: number;
  losses: number;
  created_at: string;
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        setPlayer(data);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayer();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600 dark:text-red-400">{error}</div>
    );
  }

  const winRate = player && player.matches_played > 0 
    ? ((player.wins / player.matches_played) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 프로필 헤더 */}
      <Card className="mb-6">
        <div className="p-6 flex flex-col items-center">
          {/* 아바타 */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
            {player?.avatar_url ? (
              <img src={player.avatar_url} alt={`${player.name}의 아바타`} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                {player?.name[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold mb-1">{player?.name}</h1>
            <p className="text-sm text-gray-500">
              가입일: {player?.created_at && format(new Date(player.created_at), 'PPP', { locale: ko })}
            </p>
          </div>
          <div className="mt-4 text-center">
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
          {/* RecentMatches에 선택된 사용자 ID 전달 */}
          <RecentMatches playerId={player?.id} />
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-xl font-semibold">복식 최고의 파트너</h2>
            <PartnerCard playerId={player?.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
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
  );
}
