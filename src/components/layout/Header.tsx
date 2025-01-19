'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: '대시보드', href: '/dashboard' },
  { name: '매치', href: '/matches' },
  { name: '랭킹', href: '/rankings' },
  { name: '커뮤니티', href: '/community' },
]

export default function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              테니스랭크
            </Link>
            <nav className="ml-10 space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-gray-600">{user.name}</span>
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  프로필
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}