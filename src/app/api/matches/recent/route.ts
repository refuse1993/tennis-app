import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return NextResponse.json({ error: '인증되지 않은 사용자' }, { status: 401 });
		}

		const userId = session.user.id;

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
				`team_a_player1_id.eq.${userId},team_a_player2_id.eq.${userId},team_b_player1_id.eq.${userId},team_b_player2_id.eq.${userId}`
			)
			.order('created_at', { ascending: false })
			.limit(10);

		if (error) {
			console.error('매치 조회 에러:', error);
			return NextResponse.json({ error: '매치 조회 실패' }, { status: 500 });
		}

		return NextResponse.json(matches);
	} catch (error) {
		console.error('서버 에러:', error);
		return NextResponse.json({ error: '서버 에러' }, { status: 500 });
	}
}
