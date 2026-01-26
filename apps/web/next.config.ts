import { withSentryConfig } from "@sentry/nextjs";
import withMdx from "@next/mdx";
import type { NextConfig } from "next";

const output =
  process.env.NEXT_STANDALONE === "true" ? "standalone" : undefined;

const nextConfig: NextConfig = {
  pageExtensions: ["tsx", "mdx"],
  output,
  typescript: {
    tsconfigPath: "tsconfig.app.json",
  },
  // PostHog reverse proxy configuration
  // https://posthog.com/docs/advanced/proxy/nextjs
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

const withSentry = withSentryConfig(nextConfig, {
  org: "prisma-finance",
  project: "prisma-web",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});

export default withMdx()(withSentry);
