import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/apply",
        destination: "/#pricing",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
