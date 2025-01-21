import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		// cookies()에 await 추가
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json({ error: '인증되지 않은 사용자' }, { status: 401 });
		}

		const { data: playerStats, error } = await supabase
			.from('players')
			.select('rating, matches_played, wins, losses')
			.eq('id', session.user.id)
			.single();

		if (error) {
			console.error('DB 조회 에러:', error);
			return NextResponse.json({ error: '통계 조회 실패' }, { status: 500 });
		}

		// 데이터가 없으면 기본값 반환
		return NextResponse.json(
			playerStats || {
				rating: 1500,
				matches_played: 0,
				wins: 0,
				losses: 0,
			}
		);
	} catch (error) {
		console.error('서버 에러:', error);
		return NextResponse.json({ error: '서버 에러' }, { status: 500 });
	}
}
