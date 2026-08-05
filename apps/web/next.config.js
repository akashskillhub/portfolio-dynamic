/* global process */
/** @type {import('next').NextConfig} */
const backendUrl = (
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL
    : process.env.NEXT_PUBLIC_LIVE_BACKEND_URL
)?.trim();

const nextConfig = {
  async rewrites() {
    return backendUrl
      ? [{ source: "/api/:path*", destination: `${backendUrl}/:path*` }]
      : [];
  },
};

export default nextConfig;