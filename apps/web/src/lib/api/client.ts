import posthog from "posthog-js";

function apiPath(path: string) {
  const cleaned = path.replace(/^\//, "");
  return `/api/proxy/${cleaned}`;
}

export async function fetchApi(inputPath: string) {
  const res = await fetch(apiPath(inputPath), {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const error = new Error(`API error (${res.status}): ${text}`);

    // Track API client error with PostHog
    posthog.capture("api_client_error", {
      path: inputPath,
      status: res.status,
      error_message: text || "Unknown error",
    });

    throw error;
  }

  return res;
}
