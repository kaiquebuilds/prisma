import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

function requireApiUrl() {
  if (!apiUrl) {
    throw new Error("Missing API_URL env var");
  }
  return apiUrl;
}

function requireApiKey() {
  if (!apiKey) {
    throw new Error("Missing API_KEY env var");
  }
  return apiKey;
}

function buildTargetUrl(req: NextRequest, pathSegments: string[]) {
  const apiUrl = requireApiUrl();
  const base = apiUrl.replace(/\/$/, "");
  const path = pathSegments.join("/");

  const target = new URL(`${base}/${path}`);
  const url = new URL(req.nextUrl.toString());
  target.search = url.search; // preserve query string

  return target;
}

// Get distinct ID from PostHog headers if available
function getDistinctId(req: NextRequest): string {
  const distinctId = req.headers.get("X-POSTHOG-DISTINCT-ID");
  return distinctId || "anonymous";
}

async function forward(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const targetUrl = buildTargetUrl(req, path);
  const method = req.method.toUpperCase();
  const distinctId = getDistinctId(req);
  const posthog = getPostHogClient();

  // Track API proxy request
  posthog.capture({
    distinctId,
    event: "api_proxy_request",
    properties: {
      method,
      path: `/${path.join("/")}`,
      query: targetUrl.search,
    },
  });

  const headers = req.headers;

  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    const apiKey = requireApiKey();
    headers.set("X-API-Key", apiKey);
  }

  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const resHeaders = new Headers(upstream.headers);

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: resHeaders,
    });
  } catch (error) {
    // Track API proxy error
    posthog.capture({
      distinctId,
      event: "api_proxy_error",
      properties: {
        method,
        path: `/${path.join("/")}`,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    throw error;
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, ctx);
}
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, ctx);
}
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, ctx);
}
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, ctx);
}
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, ctx);
}
