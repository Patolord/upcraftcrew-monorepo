export type TeamMemberRole = "owner" | "admin" | "manager" | "developer" | "designer" | "member";

export type TeamMemberStatus = "active" | "away" | "busy" | "offline";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  department?: string;
  position: string;
  joinDate: string;
  location?: string;
  phone?: string;
  skills?: string[];
  projectsCount: number;
  tasksCompleted: number;
  performance: number; // 0-100
  bio?: string;
};
