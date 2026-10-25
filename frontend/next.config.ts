import type { NextConfig } from "next";

/** Nest API inside the same VM (or local laptop). Browser talks to Next; Next proxies. */
const API_PROXY =
  process.env.APS_API_PROXY_TARGET ?? "http://127.0.0.1:43124";

const nextConfig: NextConfig = {
  transpilePackages: ["@aps/shared"],
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 414, 640, 768, 1080],
    imageSizes: [64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_PROXY}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/mascot/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
