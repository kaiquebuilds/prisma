export async function fetchApiFromServer(path: string) {
  const base = process.env.API_URL;
  if (!base) throw new Error("Missing API_URL in .env");

  const url = `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error (${res.status}): ${text}`);
  }

  return res;
}
