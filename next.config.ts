import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: [
      // 遠端開發機或內部跳板機來源
      "143.198.202.94",
      // 本機開發
      "localhost",
      "127.0.0.1",
    ],
  },
};

export default nextConfig;
