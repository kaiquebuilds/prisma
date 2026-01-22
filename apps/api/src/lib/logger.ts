import { env } from "@/env";
import winston from "winston";
import Transport from "winston-transport";
import * as Sentry from "@sentry/node";

const SentryTransport = Sentry.createSentryWinstonTransport(Transport);

const logger = winston.createLogger({
  transports: [new SentryTransport()],
});

if (env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
