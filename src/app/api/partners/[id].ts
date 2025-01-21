import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: { playerId: string } }) {
	const { playerId } = params;

	console.log('Received playerId:', playerId); // 디버깅
	if (!playerId) {
		return NextResponse.json({ error: 'playerId가 제공되지 않았습니다.' }, { status: 400 });
	}

	try {
		const { data, error } = await supabase
			.from('partner_stats')
			.select('partner_id, matches_played, wins, losses')
			.eq('player_id', playerId)
			.order('matches_played', { ascending: false });

		if (error) {
			throw error;
		}

		// 파트너 이름 가져오기
		const detailedData = await Promise.all(
			data.map(async (partner: any) => {
				const { data: partnerDetails, error: partnerError } = await supabase
					.from('players')
					.select('name')
					.eq('id', partner.partner_id)
					.single();

				if (partnerError) {
					throw partnerError;
				}

				return {
					name: partnerDetails.name,
					matches: partner.matches_played,
					wins: partner.wins,
					losses: partner.losses,
					winRate: ((partner.wins / partner.matches_played) * 100).toFixed(1),
				};
			})
		);

		return NextResponse.json(detailedData);
	} catch (error) {
		console.error('파트너 데이터 로드 실패:', error);
		return NextResponse.json({ error: '파트너 데이터를 불러오지 못했습니다.' }, { status: 500 });
	}
}
