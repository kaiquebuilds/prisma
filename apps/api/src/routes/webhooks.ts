import express, { Request, Response, Router } from "express";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";
import logger from "@/lib/logger";
import { clerkClient } from "@clerk/express";

const router: Router = express.Router();
const webhookSecret = env.CLERK_WEBHOOK_SECRET;

// TODO: Update the user on other Clerk-issued events
router.post("/clerk", async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const headers = req.headers as Record<string, string | string[]>;

    const wh = new Webhook(webhookSecret);
    const evt = wh.verify(payload, headers as Record<string, string>);

    const event = evt as {
      type: string;
      data: {
        id: string;
        email_addresses: Array<{ email_address: string }>;
        first_name: string;
        last_name: string;
      };
    };

    if (event.type === "user.created") {
      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
      } = event.data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name} ${last_name}`.trim();

      if (!email) {
        return res.status(400).json({ error: "No email provided" });
      }

      const existingByClerkId = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (existingByClerkId) {
        await clerkClient.users.updateUser(clerkId, {
          externalId: existingByClerkId.id,
        });
        return res.status(200).json({ success: true, user: existingByClerkId });
      }

      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });

      let user;
      if (existingByEmail) {
        // Email collision: attach clerkId to existing user
        user = await prisma.user.update({
          where: { email },
          data: { clerkId },
        });
      } else {
        user = await prisma.user.create({
          data: {
            clerkId,
            email,
            name,
            termsAcceptedVersion: env.CURRENT_TERMS_OF_SERVICE_VERSION,
            privacyAcceptedVersion: env.CURRENT_PRIVACY_POLICY_VERSION,
            termsAcceptedAt: new Date().toISOString().split("T")[0],
            privacyAcceptedAt: new Date().toISOString().split("T")[0],
          },
        });
      }

      await clerkClient.users.updateUser(clerkId, {
        externalId: user.id,
      });

      return res.status(200).json({ success: true, user });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error("Webhook error:", error);
    return res.status(400).json({ error: "Webhook verification failed" });
  }
});

export default router;
