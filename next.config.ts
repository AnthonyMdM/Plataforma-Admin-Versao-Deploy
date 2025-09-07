import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
<<<<<<< HEAD
        destination: "/home",
=======
        destination: "/home/resumo",
>>>>>>> 366723b (Começo de um projeto para plataforma de adminstração de vendas)
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
