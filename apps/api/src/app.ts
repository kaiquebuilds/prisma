import { sayHello } from "@prisma-finance/core";
import express, { Response, Request, Express } from "express";
import { PrismaClient } from "./generated/prisma/client";
import { getAuth } from "@clerk/express";
import { protectedRoute } from "./middleware/protectedRoute";

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

  v1.get("/users/me", async (req: Request, res: Response) => {
    const { userId } = getAuth(req);

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User profile not ready yet" });
    }

    return res.json({ data: user });
  });

  app.use("/v1", protectedRoute, v1);
}

export function foo() {
  return "bar";
}
