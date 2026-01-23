import { sayHello } from "@prisma-finance/core";
import express, { Response, Request, Express } from "express";
import { PrismaClient } from "./generated/prisma/client";

export function createApp(): Express {
  const app = express();
  return app;
}

export function registerRoutes(app: Express, prisma: PrismaClient): void {
  const v1 = express.Router();

  v1.get("/", async (req: Request, res: Response) => {
    const message = `${sayHello()} (from server)`;

    const user = await prisma.user.findFirst({
      where: {
        name: {
          contains: "Alex",
        },
      },
    });

    if (!user) {
      return res.json({
        message,
      });
    }

    res.json({
      message: `${message}. Welcome, ${user.name}.`,
    });
  });

  app.use("/v1", v1);
}

export function foo() {
  return "bar";
}
