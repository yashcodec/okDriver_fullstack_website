import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["9321a93d68e6b4.lhr.life"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*", 
      },
      {
        source: "/ws",
        destination: "http://127.0.0.1:8000/ws", // Note: WS proxying can be tricky in next dev, but http works
      }
    ];
  },
};

export default nextConfig;
