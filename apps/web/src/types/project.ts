export type ProjectStatus = "planning" | "in-progress" | "completed";

export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export type TeamMember = {
  _id?: string;
  name: string;
  role: string;
  imageUrl?: string;
};

export type Project = {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string | number;
  endDate?: string | number;
  budget?: number;
  progress: number; // 0-100
  client?: string;
  team?: TeamMember[];
  notes?: string;
  files?: Array<{
    id?: string;
    name: string;
    url: string;
    size: number;
    uploadedAt: number;
  }>;
};
