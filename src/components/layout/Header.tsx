'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      console.log('로그아웃 시도') // 디버깅

      // 먼저 Supabase 세션 제거
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Supabase 로그아웃 에러:', error)
        return
      }

      // 로컬 스토리지 클리어
      window.localStorage.removeItem('tennis-app-auth')
      
      // 쿠키 제거를 위한 API 호출
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
      })

      if (!response.ok) {
        throw new Error('로그아웃 API 호출 실패')
      }

      console.log('로그아웃 성공') // 디버깅

      // 페이지 새로고침으로 리다이렉트
      window.location.href = '/login'
    } catch (err) {
      console.error('로그아웃 중 에러 발생:', err)
    }
  }


  return (
    <header className="bg-white dark:bg-gray-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">테니스랭크</span>
          </Link>
        </div>
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
          <div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg">
            <div className="space-y-1 px-4 pb-3 pt-2">
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                대시보드
              </Link>
              <Link
                href="/matches/new"
                className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                매치 등록
              </Link>
              <Link
                href="/rankings"
                className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                랭킹
              </Link>
              <Link
                href="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                내정보
              </Link>
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                {theme === 'dark' ? '라이트 모드' : '다크 모드'}
              </button>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}