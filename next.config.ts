import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Se um dia usar next/image, isso garante que funcione no export estático:
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
