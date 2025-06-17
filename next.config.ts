import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos", "localhost"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
