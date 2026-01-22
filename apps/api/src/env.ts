/* eslint-disable no-console */
import dotenv from "dotenv";
import { z } from "zod";

const dotenvResult = dotenv.config({
  quiet: true,
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  CORS_ORIGIN: z.url().default("http://localhost:3000"),
  SENTRY_DSN: z.url(),
});

const isDocker = process.env.DOCKER === "true";
const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

if (!isDocker && !isProduction && !isTest) {
  if (dotenvResult.error) {
    throw new Error(
      `Missing or invalid .env file: ${dotenvResult.error.message}`,
    );
  }

  const fileValidationResult = envSchema.safeParse(dotenvResult.parsed);
  if (fileValidationResult.error) {
    console.error(
      "Invalid environment variables in .env: ",
      z.treeifyError(fileValidationResult.error).properties,
    );
    throw new Error("Invalid environment variables in .env");
  }
}

const processEnvValidationResult = envSchema.safeParse(process.env);

if (processEnvValidationResult.error) {
  console.error(
    "Invalid environment variables in process.env: ",
    z.treeifyError(processEnvValidationResult.error).properties,
  );
  throw new Error("Invalid environment variables in process.env");
}

export const env = processEnvValidationResult.data;
