import logger from "@/lib/logger";
import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error("Error encountered:", err);
  res.status(500).json({ error: "Internal Server Error" });
}
