'use client'

import Link from 'next/link'

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link 
        href="/matches/new" 
        className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <div>
          <h3 className="text-lg font-semibold">새 매치 등록</h3>
          <p className="text-sm text-blue-100">새로운 매치 결과를 기록하세요</p>
        </div>
        <span className="text-2xl">🎾</span>
      </Link>

      <Link 
        href="/rankings" 
        className="flex items-center justify-between p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <div>
          <h3 className="text-lg font-semibold">랭킹 확인</h3>
          <p className="text-sm text-green-100">현재 랭킹을 확인하세요</p>
        </div>
        <span className="text-2xl">🏆</span>
      </Link>
    </div>
  )
}