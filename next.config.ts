import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/desafio-de-front-end-seduh" : "",
  assetPrefix: isProd ? "/desafio-de-front-end-seduh" : "",
};

export default nextConfig;
