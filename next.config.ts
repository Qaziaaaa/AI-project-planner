import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/favicon.svg" },
    ]
  },
};

export default nextConfig;
