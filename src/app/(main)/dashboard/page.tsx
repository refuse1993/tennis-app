export default function DashboardPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">최근 매치</h2>
            <p className="text-gray-600">아직 매치 기록이 없습니다.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">나의 랭킹</h2>
            <p className="text-gray-600">순위 정보가 없습니다.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">커뮤니티 소식</h2>
            <p className="text-gray-600">새로운 소식이 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }