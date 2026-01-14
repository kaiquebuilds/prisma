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
    throw new Error(`API error (${res.status}): ${text}`);
  }

  return res;
}
