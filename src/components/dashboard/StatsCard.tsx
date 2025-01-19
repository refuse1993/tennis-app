interface StatsCardProps {
    title: string
    value: string | number
    icon: string
    trend?: {
      value: number
      isUpward: boolean
    }
  }
  
  export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-all hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <p className={`mt-2 text-sm ${trend.isUpward ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isUpward ? '↑' : '↓'} {trend.value}%
              </p>
            )}
          </div>
          <div className="text-3xl">
            {icon}
          </div>
        </div>
      </div>
    )
  }