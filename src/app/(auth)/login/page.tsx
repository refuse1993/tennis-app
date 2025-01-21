'use client';

import { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Logo from '@/components/ui/logo.png';

export default function LoginPage() {
	//   const router = useRouter()
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			console.log('로그인 시도:', formData.email); // 디버깅

			const { data, error: signInError } = await supabase.auth.signInWithPassword({
				email: formData.email,
				password: formData.password,
			});

			console.log('Supabase 응답:', { data, error: signInError }); // 디버깅

			if (signInError) {
				throw signInError;
			}

			if (data?.user) {
				console.log('로그인 성공, 사용자:', data.user); // 디버깅

				// 세션 확인
				const {
					data: { session },
				} = await supabase.auth.getSession();
				console.log('현재 세션:', session); // 디버깅

				// 쿠키 설정을 위해 서버에 세션 정보 전달
				const response = await fetch('/api/auth/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ session: data.session }),
				});

				if (response.ok) {
					window.location.href = '/dashboard';
				} else {
					setError('세션 설정에 실패했습니다.');
				}
			}
		} catch (err) {
			console.error('로그인 에러:', err);
			setError('이메일 또는 비밀번호가 올바르지 않습니다.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md space-y-8">
			<div className="flex flex-col items-center">
				<Image src={Logo} alt="XSS 로고" className="w-64 h-64 mb-4" />
			</div>
			{error && (
				<div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
					<span className="block sm:inline">{error}</span>
				</div>
			)}

			<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
				<div className="rounded-md shadow-sm space-y-4">
					<div>
						<label htmlFor="email" className="sr-only">
							이메일
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
							placeholder="이메일"
							value={formData.email}
							onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
						/>
					</div>
					<div>
						<label htmlFor="password" className="sr-only">
							비밀번호
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
							placeholder="비밀번호"
							value={formData.password}
							onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
					>
						{loading ? '로그인 중...' : '로그인'}
					</button>
				</div>
			</form>

			<div className="text-center">
				<Link href="/register" className="text-sm text-blue-600 hover:text-blue-500">
					계정이 없으신가요? 회원가입
				</Link>
			</div>
		</div>
	);
}
