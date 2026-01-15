"use client";

import { useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { ProjectHeader } from "./_components/project-header";
import { ProjectsStats } from "./_components/projects-stats";
import type { Project } from "@/types/project";
import { ProjectsList } from "./_components/projects-list";

export default function ProjectsPage() {
  const { isSignedIn } = useAuth();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);

  // Ensure user exists in Convex when they sign in
  useEffect(() => {
    if (isSignedIn) {
      ensureCurrentUser().catch((error) => {
        console.error("Failed to ensure user:", error);
      });
    }
  }, [ensureCurrentUser, isSignedIn]);

  // Fetch projects from Convex
  const convexProjects = useQuery(api.projects.getProjects);

  // Transform Convex data to Project type
  const projects = useMemo(() => {
    if (!convexProjects) return [];
    return convexProjects;
  }, [convexProjects]);

  return (
    <div className="p-6 pl-12 pr-12 space-y-6">
      <ProjectHeader />

      <ProjectsStats projects={projects as unknown as Project[]} />
      <ProjectsList projects={projects as unknown as Project[]} viewMode="grid" />
    </div>
  );
}
