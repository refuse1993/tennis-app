'use client';

import { useState, useEffect } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import StatsCard from '@/components/dashboard/StatsCard';
import RecentMatches from '@/components/dashboard/RecentMatchesUser';
import QuickActions from '@/components/dashboard/QuickActions';

interface PlayerStats {
	rating: number;
	matches_played: number;
	wins: number;
	losses: number;
}

export default function DashboardPage() {
	const [stats, setStats] = useState<PlayerStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// API를 통해 플레이어 통계 가져오기
		fetch('/api/players/stats')
			.then((res) => res.json())
			.then((data) => {
				setStats(data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('통계 로딩 에러:', error);
				setIsLoading(false);
			});
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	const winRate = stats?.matches_played ? ((stats.wins / stats.matches_played) * 100).toFixed(1) : '0.0';

	return (
		<div className="space-y-8">
			{/* 통계 카드 그리드 */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatsCard title="레이팅" value={stats?.rating ?? 1500} />
				<StatsCard title="승리" value={stats?.wins ?? 0} />
				<StatsCard title="패배" value={stats?.losses ?? 0} />
				<StatsCard title="승률" value={`${winRate}%`} />
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
						onClick={() => (window.location.href = '/matches')}
						className="text-sm text-blue-600 hover:text-blue-800"
					>
						전체 보기
					</button>
				</div>
				<RecentMatches />
			</div>
		</div>
	);
}
