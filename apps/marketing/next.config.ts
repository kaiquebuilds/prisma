import type { NextConfig } from "next";
import nextMdx from "@next/mdx";

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: "tsconfig.app.json",
  },
  pageExtensions: ["tsx", "mdx"],
};

const withMdx = nextMdx();

export default withMdx(nextConfig);
