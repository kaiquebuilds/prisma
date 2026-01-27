import { auth } from "@clerk/nextjs/server";

export async function fetchApiFromServer(path: string) {
  const { getToken } = await auth();
  const token = await getToken();

  const base = process.env.API_URL;

  if (!base) throw new Error("Missing API_URL in .env");

  const url = `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  return fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
