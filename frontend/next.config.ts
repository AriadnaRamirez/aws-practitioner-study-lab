import type { NextConfig } from "next";

/** Nest API inside the same VM (or local laptop). Browser talks to Next; Next proxies. */
const API_PROXY =
  process.env.APS_API_PROXY_TARGET ?? "http://127.0.0.1:43124";

const nextConfig: NextConfig = {
  transpilePackages: ["@aps/shared"],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_PROXY}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
