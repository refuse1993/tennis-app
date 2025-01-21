import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request, { params }: { params: { id: string } }) {
	const { id: playerId } = await params;

	// playerId가 없을 경우 에러 반환
	if (!playerId) {
		return NextResponse.json({ error: 'Player ID가 제공되지 않았습니다.' }, { status: 400 });
	}

	try {
		// Supabase 클라이언트 생성
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		// Supabase에서 매치 데이터 조회
		const { data: matches, error } = await supabase
			.from('matches')
			.select(
				`
				id,
				created_at,
				winner_team,
				team_a_sets,
				team_b_sets,
				team_a_player1:team_a_player1_id(id, name),
				team_a_player2:team_a_player2_id(id, name),
				team_b_player1:team_b_player1_id(id, name),
				team_b_player2:team_b_player2_id(id, name)
			`
			)
			.or(
				`team_a_player1_id.eq.${playerId},team_a_player2_id.eq.${playerId},team_b_player1_id.eq.${playerId},team_b_player2_id.eq.${playerId}`
			)
			.order('created_at', { ascending: false })
			.limit(10);

		// 매치 조회 중 에러 처리
		if (error) {
			console.error('매치 조회 에러:', error);
			return NextResponse.json({ error: '매치 조회 실패' }, { status: 500 });
		}

		return NextResponse.json(matches);
	} catch (error) {
		console.error('서버 에러:', error);
		return NextResponse.json({ error: '서버 에러 발생' }, { status: 500 });
	}
}
