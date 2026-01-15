import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@up-craft-crew-app/backend", "@up-craft-crew-app/env"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
