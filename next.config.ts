import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
      /* ignore build errors */
  ignoreBuildErrors: true,
  eslint: {
    ignoreDuringBuilds: true,
},
};

export default nextConfig;
