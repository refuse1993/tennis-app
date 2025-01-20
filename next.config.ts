import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
      /* ignore build errors */
  ignoreBuildErrors: true,
  eslint: {
    ignoreDuringBuilds: true,
},
};

module.exports = {
  images: {
    domains: ['izuitzvmayfqoswqdeqt.supabase.co'], // 이미지 호스트 추가
  },
};

export default nextConfig;
