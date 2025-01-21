import React, { useEffect, useState } from 'react';

interface Partner {
	name: string;
	matches: number;
	wins: number;
	losses: number;
	winRate: string;
}

interface PartnerCardProps {
	playerId: string | undefined;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ playerId }) => {
	const [partners, setPartners] = useState<Partner[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!playerId) {
			setIsLoading(false);
			return;
		}

		fetch(`/api/partners/${playerId}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					throw new Error(data.error);
				}
				setPartners(Array.isArray(data) ? data : []);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error('파트너 데이터 로드 실패:', err);
				setError('파트너 정보를 불러오지 못했습니다.');
				setIsLoading(false);
			});
	}, [playerId]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-20">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return <div className="text-center text-red-500">{error}</div>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
			{partners.map((partner, index) => (
				<div key={index} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
					<div className="flex items-center p-3">
						{/* Number and Name */}
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className="text-lg font-bold text-gray-500">{index + 1}.</span>
								<h3 className="text-lg font-bold text-gray-800">{partner.name}</h3>
							</div>
						</div>

						{/* Type Icon */}
						<div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
							<span className="text-white text-sm">🏆</span>
						</div>
					</div>

					{/* Stats Icons Row */}
					<div className="px-3 pb-3">
						<div className="flex gap-1">
							{/* Match Icon */}
							<div className="flex items-center bg-gray-100 rounded px-2 py-1">
								<span className="text-sm">⚔️</span>
								<span className="ml-1 text-sm font-bold">{partner.matches}</span>
							</div>

							{/* Win Icon */}
							<div className="flex items-center bg-green-100 rounded px-2 py-1">
								<span className="text-sm">✨</span>
								<span className="ml-1 text-sm font-bold text-green-700">{partner.wins}</span>
							</div>

							{/* Loss Icon */}
							<div className="flex items-center bg-red-100 rounded px-2 py-1">
								<span className="text-sm">💫</span>
								<span className="ml-1 text-sm font-bold text-red-700">{partner.losses}</span>
							</div>

							{/* Win Rate Icon */}
							<div className="flex items-center bg-blue-100 rounded px-2 py-1">
								<span className="text-sm">📊</span>
								<span className="ml-1 text-sm font-bold text-blue-700">{partner.winRate}%</span>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default PartnerCard;
