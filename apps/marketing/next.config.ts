import type { NextConfig } from "next";
import nextMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["tsx", "mdx"],
};

const withMdx = nextMDX();

export default withMdx(nextConfig);
