"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Capture error with Sentry
    Sentry.captureException(error);

    // Capture error with PostHog
    posthog.capture("global_error", {
      error_message: error.message,
      error_name: error.name,
      error_digest: error.digest,
      error_stack: error.stack,
    });

    // Also use PostHog's built-in exception capture
    posthog.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
