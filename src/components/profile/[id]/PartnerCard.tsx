import React, { useEffect, useState } from 'react';

interface Partner {
  name: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: string;
}

interface PartnerCardProps {
  playerId: string | undefined;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ playerId }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // playerId가 없으면 fetch 실행하지 않음
    if (!playerId) {
      setIsLoading(false);
      return;
    }

    fetch(`/api/partners/${playerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        // 받은 데이터가 배열이면 그대로, 아니라면 빈 배열 처리
        setPartners(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('파트너 데이터 로드 실패:', err);
        setError('파트너 정보를 불러오지 못했습니다.');
        setIsLoading(false);
      });
  }, [playerId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {partners.map((partner, index) => (
        <div
          key={index}
          className="p-4 bg-white shadow-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {partner.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            함께한 경기: {partner.matches}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            승리: {partner.wins} / 패배: {partner.losses}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            승률: {partner.winRate}%
          </p>
        </div>
      ))}
    </div>
  );
};

export default PartnerCard;