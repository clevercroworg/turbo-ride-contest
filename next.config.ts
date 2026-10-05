import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/vouchers/check",
        destination: "/api/vouchers/check",
      },
      {
        source: "/vouchers/redeem",
        destination: "/api/vouchers/redeem",
      },
    ];
  },
};

export default nextConfig;
