import { env } from "./env";
import cors from "cors";

import { app } from "./app";
import { prisma } from "./lib/prisma";

// TODO: Only allow localhost and frontend origins
app.use(cors());

const port = env.PORT;

await prisma.$connect();

const server = app.listen(port, () => {
  console.log(`Server listening at port ${port}...`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
