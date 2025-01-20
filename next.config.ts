/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint 빌드 오류 무시 설정
  ignoreBuildErrors: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 이미지 도메인 설정
  images: {
    domains: ['izuitzvmayfqoswqdeqt.supabase.co'],
  },
};

module.exports = nextConfig;