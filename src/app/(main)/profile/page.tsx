'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import RecentMatches from '@/components/dashboard/RecentMatches';

interface Player {
	id: string;
	name: string;
	rating: number;
	matches_played: number;
	wins: number;
	losses: number;
	created_at: string;
	avatar_url: string | null;
}

export default function PlayerProfilePage() {
	const [player, setPlayer] = useState<Player | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchPlayerData = async () => {
			try {
				const {
					data: { session },
					error: sessionError,
				} = await supabase.auth.getSession();

				if (sessionError) throw sessionError;

				if (!session?.user) {
					router.push('/login');
					return;
				}

				const { data: playerData, error: playerError } = await supabase
					.from('players')
					.select('*')
					.eq('id', session.user.id)
					.single();

				if (playerError) {
					throw playerError;
				} else {
					setPlayer(playerData);
				}
			} catch (error) {
				console.error('플레이어 데이터 로딩 에러:', error);
				setError('플레이어 정보를 불러오는데 실패했습니다.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchPlayerData();
	}, [router]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return <div className="text-center py-4 text-red-600 dark:text-red-400">{error}</div>;
	}

	const winRate =
		player && player.matches_played > 0 ? ((player.wins / player.matches_played) * 100).toFixed(1) : '0.0';

	return (
		<div className="container mx-auto px-4 py-6">
			{/* 프로필 헤더 */}
			<Card className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md">
				<div className="p-4 flex items-center">
					<div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white">
						{player?.avatar_url ? (
							<img src={player.avatar_url} alt="프로필 이미지" className="object-cover w-full h-full" />
						) : (
							<div className="bg-gray-300 w-full h-full flex items-center justify-center text-lg font-bold text-gray-600">
								{player?.name[0]?.toUpperCase()}
							</div>
						)}
					</div>
					<div className="ml-4">
						<h1 className="text-xl font-semibold mb-1">{player?.name}</h1>
						<p className="text-xs text-gray-200">
							가입일: {player?.created_at && format(new Date(player.created_at), 'PPP', { locale: ko })}
						</p>
					</div>
					<div className="ml-auto text-center">
						<div className="text-2xl font-bold">{player?.rating}</div>
						<div className="text-xs text-gray-200">레이팅</div>
					</div>
				</div>
			</Card>

			{/* 탭 메뉴 */}
			<Tabs defaultValue="overview" className="mb-4">
				<TabsList className="flex justify-center mb-2">
					<TabsTrigger value="overview" className="px-3 py-1 text-sm">
						개요
					</TabsTrigger>
					<TabsTrigger value="matches" className="px-3 py-1 text-sm">
						매치 기록
					</TabsTrigger>
					<TabsTrigger value="stats" className="px-3 py-1 text-sm">
						상세 통계
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
						<StatCard
							title="승/패"
							value={`${player?.wins}승 ${player?.losses}패`}
							subValue={`승률 ${winRate}%`}
						/>
						<StatCard title="레이팅" value={player?.rating ?? 0} subValue="현재 레이팅" />
						<StatCard title="총 경기" value={player?.matches_played ?? 0} subValue="매치 수" />
					</div>
				</TabsContent>

				<TabsContent value="matches">
					{player?.id ? (
						<RecentMatches playerId={player.id} />
					) : (
						<div className="text-center text-gray-500">플레이어 데이터를 불러오는 중입니다.</div>
					)}
				</TabsContent>

				<TabsContent value="stats">
					<div className="grid grid-cols-1 gap-2">
						<Card className="p-4">
							<h3 className="text-sm font-medium mb-2">매치 통계</h3>
							<p>여기에 매치 관련 통계를 추가하세요.</p>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function StatCard({ title, value, subValue }: { title: string; value: string | number; subValue: string }) {
	return (
		<Card className="p-4 bg-white shadow-sm rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
			<h3 className="text-xs font-medium text-gray-500 mb-1">{title}</h3>
			<div className="text-lg font-bold mb-1">{value}</div>
			<div className="text-xs text-gray-400">{subValue}</div>
		</Card>
	);
}
