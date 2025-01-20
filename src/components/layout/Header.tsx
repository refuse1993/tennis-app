'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Supabase 세션 제거
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase 로그아웃 에러:', error);
        return;
      }

      // 로컬 스토리지 클리어
      window.localStorage.removeItem('tennis-app-auth');

      // 쿠키 제거를 위한 API 호출
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('로그아웃 API 호출 실패');
      }

      // 페이지 새로고침으로 리다이렉트
      window.location.href = '/login';
    } catch (err) {
      console.error('로그아웃 중 에러 발생:', err);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 relative z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* 로고 */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">테니스랭크</span>
          </Link>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">메뉴 열기</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* 데스크톱 메뉴 */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            href="/dashboard"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            대시보드
          </Link>
          <Link
            href="/matches/new"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            매치 등록
          </Link>
          <Link
            href="/rankings"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            랭킹
          </Link>
          <Link
            href="/profile"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            내정보
          </Link>
        </div>

        {/* 다크 모드 및 로그아웃 버튼 */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            {theme === 'dark' ? '라이트 모드' : '다크 모드'}
          </button>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400"
          >
            로그아웃
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            <div className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 z-50 shadow-lg p-4">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-bold text-gray-900 dark:text-white">메뉴</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                >
                  닫기
                </button>
              </div>
              <div className="space-y-4">
                <Link
                  href="/dashboard"
                  className="block text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  대시보드
                </Link>
                <Link
                  href="/matches/new"
                  className="block text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  매치 등록
                </Link>
                <Link
                  href="/rankings"
                  className="block text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  랭킹
                </Link>
                <Link
                  href="/profile"
                  className="block text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  내정보
                </Link>
                <button
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {theme === 'dark' ? '라이트 모드' : '다크 모드'}
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
