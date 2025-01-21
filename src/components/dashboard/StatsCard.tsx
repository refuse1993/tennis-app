interface StatsCardProps {
	title: string;
	value: string | number;
	trend?: {
		value: number;
		isUpward: boolean;
	};
}

export default function StatsCard({ title, value, trend }: StatsCardProps) {
	return (
		<div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg shadow-md p-4 transition-transform hover:-translate-y-1 hover:shadow-lg">
			{/* 빛나는 배경 */}
			<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 blur-md rounded-lg"></div>
			<div className="relative z-10">
				{/* Title */}
				<p className="text-xs font-medium text-gray-300 tracking-wide drop-shadow-sm">{title}</p>
				{/* Value */}
				<p className="mt-2 text-3xl font-extrabold bg-gradient-to-r from-purple-200 to-indigo-500 text-transparent bg-clip-text drop-shadow-md">
					{value}
				</p>
				{/* Trend */}
				{trend && (
					<p
						className={`mt-1 text-xs font-medium ${
							trend.isUpward ? 'text-green-400' : 'text-red-400'
						} drop-shadow-sm`}
					>
						{trend.isUpward ? '▲' : '▼'} {trend.value}%
					</p>
				)}
			</div>
		</div>
	);
}
