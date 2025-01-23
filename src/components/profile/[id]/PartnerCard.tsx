'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Partner {
	id: string;
	name: string;
	avatar_url: string | null;
}

interface PartnerCardProps {
	playerId: string | undefined;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ playerId }) => {
	const [partners, setPartners] = useState<Partner[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPartners = async () => {
			if (!playerId) return;

			try {
				const { data, error } = await supabase.from('partners').select('*').eq('player_id', playerId);

				if (error) throw error;

				setPartners(data);
			} catch (error) {
				console.error('파트너 로딩 에러:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPartners();
	}, [playerId]); // playerId만 의존성으로 설정

	if (isLoading) {
		return <div>로딩 중...</div>;
	}

	if (!partners.length) {
		return <div>파트너가 없습니다.</div>;
	}

	return (
		<div>
			{partners.map((partner) => (
				<div key={partner.id}>
					<img src={partner.avatar_url || '/default-avatar.png'} alt={partner.name} />
					<p>{partner.name}</p>
				</div>
			))}
		</div>
	);
};

export default PartnerCard;
