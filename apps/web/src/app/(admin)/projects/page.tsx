import { requireAuthWithToken } from "@/lib/server-auth";
import { ProjectsPage } from "./_components/projects-page";
import React from "react";

// Force dynamic rendering since we need auth at runtime
export const dynamic = "force-dynamic";

export default async function Page() {
  // Get authenticated user and token
  await requireAuthWithToken();

  return <ProjectsPage />;
}
