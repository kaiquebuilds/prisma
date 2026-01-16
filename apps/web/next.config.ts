import type { NextConfig } from "next";

const output =
  process.env.NEXT_STANDALONE === "true" ? "standalone" : undefined;

const nextConfig: NextConfig = {
  output,
};

export default nextConfig;
