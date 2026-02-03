import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().optional(),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  },
  emptyStringAsUndefined: true,
});
