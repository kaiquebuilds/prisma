import dotenv from "dotenv";
import { z } from "zod";

const output = dotenv.config();

if (output.error) {
  throw new Error("Error parsing .env");
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
});

const validationResult = envSchema.safeParse(output.parsed);

if (validationResult.error) {
  throw new Error(".env validation failed");
}

export const env = validationResult.data;
