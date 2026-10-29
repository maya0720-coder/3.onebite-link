import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // localhost 외 주소(127.0.0.1, 사내망 IP)로 접속해도 개발 서버 리소스가 차단되지 않도록 허용
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
