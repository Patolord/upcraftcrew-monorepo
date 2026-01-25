import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  transpilePackages: ["@up-craft-crew-app/backend", "@up-craft-crew-app/env"],
  serverExternalPackages: ["playwright", "playwright-core"],
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle Playwright in the client bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        playwright: false,
        "playwright-core": false,
      };
    }
    return config;
  },
};

export default withSerwist(nextConfig);
