import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home/resumo",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
