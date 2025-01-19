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
      console.log('로그아웃 시도')
  
      // 1. Supabase 세션 제거
      await supabase.auth.signOut()
      
      // 2. 로컬 스토리지 클리어
      if (typeof window !== 'undefined') {
        window.localStorage.clear()
      }
      
      // 3. 모든 쿠키 제거
      const cookies = document.cookie.split(';')
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
      }
  
      console.log('로그아웃 처리 완료')
      
      // 4. 페이지 새로고침으로 리다이렉트
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
            <span className="text-2xl font-bold">테니스랭크</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">메뉴 열기</span>
            {/* 햄버거 메뉴 아이콘 */}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/dashboard" className="text-sm font-semibold leading-6 text-gray-900">
            대시보드
          </Link>
          <Link href="/matches" className="text-sm font-semibold leading-6 text-gray-900">
            매치
          </Link>
          <Link href="/rankings" className="text-sm font-semibold leading-6 text-gray-900">
            랭킹
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
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
      </nav>
    </header>
  )
}