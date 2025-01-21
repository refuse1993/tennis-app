'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Player {
	id: string;
	name: string;
}

interface Match {
	id: string;
	created_at: string;
	winner_team: 'A' | 'B';
	team_a_player1: Player;
	team_a_player2: Player;
	team_b_player1: Player;
	team_b_player2: Player;
	team_a_sets: number;
	team_b_sets: number;
}

interface RecentMatchesProps {
	playerId: string | undefined; // undefined를 허용
}

const RecentMatches: React.FC<RecentMatchesProps> = ({ playerId }) => {
	const [matches, setMatches] = useState<Match[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	useEffect(() => {
		if (!playerId) {
			console.error('playerId가 없습니다!');
			setIsLoading(false); // 로딩 상태 종료
			return;
		}
		setCurrentUserId(playerId);

		fetch(`/api/matches/recent/${playerId}`)
			.then((res) => res.json())
			.then((data) => {
				console.log('API 응답 데이터:', data);
				setMatches(data); // 데이터 설정
			})
			.catch((error) => {
				console.error('API 요청 실패:', error);
			})
			.finally(() => {
				setIsLoading(false); // 로딩 상태 종료
			});
	}, [playerId]);

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{Array(6)
					.fill(null)
					.map((_, idx) => (
						<div key={idx} className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
					))}
			</div>
		);
	}

	if (!matches.length) {
		return <div className="text-center py-8 text-gray-500">아직 매치 기록이 없습니다.</div>;
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
			{matches.map((match) => {
				const isUserInTeamA = playerId === match.team_a_player1.id || playerId === match.team_a_player2.id;
				const isUserInTeamB = playerId === match.team_b_player1.id || playerId === match.team_b_player2.id;
				const userTeam = isUserInTeamA ? 'A' : isUserInTeamB ? 'B' : null;
				const userWin = userTeam === match.winner_team;

				return (
					<div
						key={match.id}
						className={`bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all p-2.5 ${
							userWin ? 'border-2 border-green-500' : userTeam ? 'border-2 border-red-500' : ''
						}`}
					>
						{/* 날짜와 승패 */}
						<div className="flex justify-between items-center mb-1.5">
							<span className="text-[10px] text-gray-500">
								{format(new Date(match.created_at), 'M.d HH:mm')}
							</span>
							{userTeam ? (
								<span
									className={`text-[10px] px-1.5 py-0.5 rounded-full ${
										userWin
											? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
											: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
									}`}
								>
									{userWin ? '승리' : '패배'}
								</span>
							) : (
								<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
									관전
								</span>
							)}
						</div>

						{/* 스코어 */}
						<div className="flex justify-center items-center my-1.5">
							<div
								className={`text-lg font-bold ${
									match.winner_team === 'A'
										? 'text-blue-600 dark:text-blue-400'
										: 'text-gray-600 dark:text-gray-400'
								}`}
							>
								{match.team_a_sets}
							</div>
							<div className="text-sm mx-1.5 text-gray-400">:</div>
							<div
								className={`text-lg font-bold ${
									match.winner_team === 'B'
										? 'text-blue-600 dark:text-blue-400'
										: 'text-gray-600 dark:text-gray-400'
								}`}
							>
								{match.team_b_sets}
							</div>
						</div>

						{/* 팀 정보 */}
						<div className="text-center text-[11px] leading-tight">
							<div
								className={`${
									isUserInTeamA
										? 'font-bold text-blue-500 dark:text-blue-400'
										: 'text-gray-900 dark:text-white'
								}`}
							>
								{match.team_a_player1.name.split(' ')[0]}, {match.team_a_player2.name.split(' ')[0]}
							</div>
							<div className="text-[10px] text-gray-400 my-0.5">vs</div>
							<div
								className={`${
									isUserInTeamB
										? 'font-bold text-blue-500 dark:text-blue-400'
										: 'text-gray-900 dark:text-white'
								}`}
							>
								{match.team_b_player1.name.split(' ')[0]}, {match.team_b_player2.name.split(' ')[0]}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default RecentMatches;
