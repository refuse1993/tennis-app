'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Player {
  id: string;
  name: string;
  avatar_url: string | null;
  rating: number;
  matches_played: number;
  wins: number;
  losses: number;
}

export default function RankingsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // 현재 사용자 ID
  const router = useRouter();

  useEffect(() => {
    const loadRankings = async () => {
      try {
        // 현재 로그인된 사용자 정보 가져오기
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setCurrentUserId(session?.user.id || null);

        // 랭킹 데이터 가져오기
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;
        setPlayers(data || []);
        setFilteredPlayers(data || []);
      } catch (error) {
        console.error('랭킹 로딩 에러:', error);
        setError('랭킹을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRankings();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter((player) =>
        player.name.toLowerCase().includes(term)
      );
      setFilteredPlayers(filtered);
    }
  };

  const navigateToPlayer = (playerId: string) => {
    if (playerId === currentUserId) {
      router.push('/profile'); // 내 프로필 페이지로 이동
    } else {
      router.push(`/profile/${playerId}`); // 다른 사용자 프로필 페이지로 이동
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        테니스 전적 랭킹
      </h1>
      
      {/* 검색창 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="플레이어 이름 검색..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-gray-300"
        />
      </div>

      {/* 플레이어 리스트 */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        {filteredPlayers.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => navigateToPlayer(player.id)} // 클릭 이벤트 추가
          >
            <div className="text-gray-500 dark:text-gray-400 font-medium w-8 text-center">
              {index + 1}
            </div>

            <div className="relative w-12 h-12 flex-shrink-0">
              {player.avatar_url ? (
                <Image
                  src={player.avatar_url}
                  alt={`${player.name}의 아바타`}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="bg-gray-200 rounded-full flex items-center justify-center w-12 h-12 text-sm font-bold text-gray-600">
                  {player.name[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <div className="ml-4 flex-grow">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                {player.name}
              </h2>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                경기 수: {player.matches_played} | 승/패: {player.wins}승 {player.losses}패
              </div>
            </div>

            <div className="ml-auto">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-3 py-1 text-xs font-semibold rounded-full">
                {player.rating} 점
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
