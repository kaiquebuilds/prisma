import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.API_URL;

function requireApiUrl() {
  if (!apiUrl) {
    throw new Error("Missing API_URL env var");
  }
  return apiUrl;
}

function buildTargetUrl(req: NextRequest, pathSegments: string[]) {
  const base = requireApiUrl().replace(/\/$/, "");
  const path = pathSegments.join("/");

  const target = new URL(`${base}/${path}`);
  const url = new URL(req.nextUrl.toString());
  target.search = url.search; // preserve query string

  return target;
}

async function forward(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const targetUrl = buildTargetUrl(req, path);

  const method = req.method.toUpperCase();

  const headers = req.headers;
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

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
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, ctx);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, ctx);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, ctx);
}
