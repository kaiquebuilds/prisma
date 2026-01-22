import { env } from "@/env";
import { NextFunction, Request, Response } from "express";

export function apiAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestApiKey = req.headers["x-api-key"];

  if (!requestApiKey || requestApiKey !== env.API_KEY) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or missing API key",
    });
  }

  next();
}
