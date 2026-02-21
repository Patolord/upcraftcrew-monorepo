import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // Production: custom domain
      domain: "https://clerk.upcraftcrew.com",
      applicationID: "convex",
    },
    {
      // Production: Clerk's hosted domain (backup)
      domain: "https://improved-sheepdog-96.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
