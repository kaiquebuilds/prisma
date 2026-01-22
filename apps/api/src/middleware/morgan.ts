import morgan, { TokenIndexer } from "morgan";
import logger from "../lib/logger";
import { Request, Response } from "express";
import { env } from "@/env";

if (env.NODE_ENV === "development") {
  morgan.token("body", (req: Request) => JSON.stringify(req.body));
}

const morganMiddleware =
  env.NODE_ENV === "development"
    ? morgan("dev")
    : morgan(
        function (tokens: TokenIndexer, req: Request, res: Response) {
          return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"),
            "-",
            tokens["response-time"](req, res),
            "ms",
          ].join(" ");
        },
        {
          stream: {
            write: (message: string) => logger.info(message.trim()),
          },
        },
      );

export { morganMiddleware };
