import { env } from "./env";
import { createApp, registerRoutes } from "./app";
import { prisma } from "./lib/prisma";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";

const port = env.PORT;
const app = createApp();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "We’re receiving a lot of requests right now. Please try again in a few seconds.",
});

app.use(limiter);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);
app.use(express.json());

registerRoutes(app, prisma);

const server = app.listen(port, async () => {
  console.log(`Server listening at port ${port}...`);
  await prisma
    .$connect()
    .then(() => {
      console.log("Connected to the database.");
    })
    .catch((err) => {
      console.error("Failed to connect to the database:", err);
    });
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
