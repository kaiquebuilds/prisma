import { auth } from "@clerk/nextjs/server";

export async function fetchApiFromServer(path: string) {
  const { getToken } = await auth();
  const token = await getToken();

  const base = process.env.API_URL;
  const apiKey = process.env.API_KEY;
  if (!base) throw new Error("Missing API_URL in .env");
  if (!apiKey) throw new Error("Missing API_KEY in .env");

  const url = `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  return fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-API-Key": apiKey,
    },
  });
}
