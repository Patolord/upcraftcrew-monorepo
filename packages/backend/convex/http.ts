import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { httpAction } from "./_generated/server";

const http = httpRouter();

/**
 * Clerk webhook handler
 * This syncs user data from Clerk to Convex
 * Configure this endpoint in your Clerk dashboard: https://dashboard.clerk.com
 * URL: https://your-deployment.convex.site/clerk-users-webhook
 */
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Get the webhook secret from environment variables
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET is not set");
      return new Response("Webhook Secret not configured", { status: 500 });
    }

    // Verify the webhook signature
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const body = await request.text();

    const wh = new Webhook(webhookSecret);
    let event: WebhookEvent;

    try {
      event = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    // Handle the webhook event
    const eventType = event.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      await ctx.runMutation(internal.users.upsertFromClerk, {
        data: {
          id,
          first_name: first_name ?? undefined,
          last_name: last_name ?? undefined,
          email_addresses,
          image_url: image_url ?? undefined,
        },
      });

      console.log(`User ${eventType}:`, id);
    } else if (eventType === "user.deleted") {
      const { id } = event.data;

      if (id) {
        await ctx.runMutation(internal.users.deleteFromClerk, {
          clerkUserId: id,
        });

        console.log("User deleted:", id);
      }
    }

    return new Response("Webhook processed", { status: 200 });
  }),
});

// TODO: Set up auth routes and admin registration
// import { authComponent, createAuth } from "./auth";
// import { registerAdminUser } from "./registerAdmin";
// authComponent.registerRoutes(http, createAuth);

export default http;
