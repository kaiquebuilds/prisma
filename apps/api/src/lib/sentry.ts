import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://0a903f7f299c0c8cda7f8ac90c31a1d3@o4510754313076736.ingest.us.sentry.io/4510754314715136",
  integrations: [nodeProfilingIntegration()],

  enableLogs: true,
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
});

export { Sentry };
