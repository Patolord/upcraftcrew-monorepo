import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { registerAdminUser } from "./registerAdmin";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// CRITICAL SECURITY: Admin registration endpoint
// This endpoint is ONLY for initial setup in development
// It is protected by environment checks within registerAdminUser
// DO NOT remove this comment or the environment protection
http.route({
  path: "/registerAdmin",
  method: "POST",
  handler: registerAdminUser,
});

export default http;
