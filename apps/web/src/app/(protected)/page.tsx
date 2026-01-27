import { fetchApiFromServer } from "@/lib/api/server";
import { UserNotFound } from "@/ui/UserNotFound";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data } = await fetchApiFromServer("/v1/users/me").then((r) =>
    r.json(),
  );

  return <div>{data ? <h1>Welcome {data.name}!</h1> : <UserNotFound />}</div>;
}
