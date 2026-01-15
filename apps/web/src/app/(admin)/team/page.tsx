"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { Button } from "@base-ui/react/button";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { NewTeamMemberModal } from "./_components/new-team-member-modal";
import { TeamMemberCard } from "./_components/team-member-card";
import { TeamMemberRow } from "./_components/team-member-row";
import { TeamMemberRole } from "@/types/team";
import {
  AlertCircleIcon,
  TableIcon,
  UserPlusIcon,
  UsersRoundIcon,
  LayoutGridIcon,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamHeader } from "./_components/team-header";

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch team members from Convex
  const teamMembers = useQuery(api.team.getTeamMembers);

  // Compute departments and filtered members
  const { departments, filteredMembers } = useMemo(() => {
    if (!teamMembers) {
      return { departments: [], filteredMembers: [] };
    }

    const departments = Array.from(
      new Set(teamMembers.map((m) => m.department).filter(Boolean)),
    ) as string[];

    const filteredMembers = teamMembers.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.department || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || member.role === roleFilter;

      const matchesDepartment =
        departmentFilter === "all" || member.department === departmentFilter;

      return matchesSearch && matchesRole && matchesDepartment;
    });

    return { departments, filteredMembers };
  }, [teamMembers, searchQuery, roleFilter, departmentFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!teamMembers) {
      return {
        total: 0,
        online: 0,
        departments: 0,
        avgProjects: 0,
      };
    }

    return {
      total: teamMembers.length,
      online: teamMembers.filter((m) => m.status === "online").length,
      departments: departments.length,
      avgProjects:
        teamMembers.length > 0
          ? Math.round(
              teamMembers.reduce((acc, m) => acc + m.projects.length, 0) / teamMembers.length,
            )
          : 0,
    };
  }, [teamMembers, departments]);

  return (
    <div className="p-6 space-y-6">
      <TeamHeader />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card size="sm" className="rounded-lg items-center justify-center">
          <CardContent className="flex flex-col gap-1">
            <div className="text-muted-foreground text-xs">Total Members</div>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card size="sm" className="rounded-lg items-center justify-center">
          <CardContent className="flex flex-col gap-1">
            <div className="text-muted-foreground text-xs">Online</div>
            <div className="text-2xl font-semibold text-green-600">{stats.online}</div>
          </CardContent>
        </Card>
        <Card size="sm" className="rounded-lg items-center justify-center">
          <CardContent className="flex flex-col gap-1">
            <div className="text-muted-foreground text-xs">Departments</div>
            <div className="text-2xl font-semibold">{stats.departments}</div>
          </CardContent>
        </Card>
        <Card size="sm" className="rounded-lg items-center justify-center">
          <CardContent className="flex flex-col gap-1">
            <div className="text-muted-foreground text-xs">Avg Projects</div>
            <div className="text-2xl font-semibold">{stats.avgProjects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid/Table */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={UsersRoundIcon}
          title="No team members found"
          description="Try adjusting your search or filters"
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <TeamMemberCard key={member._id} member={member} />
          ))}
        </div>
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Contact & Skills</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Projects</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TeamMemberRow key={member._id} member={member} />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* New Team Member Modal */}
      <NewTeamMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
