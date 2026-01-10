"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { Button } from "@base-ui/react/button";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { NewTeamMemberModal } from "./_components/new-team-member-modal";
import { TeamMemberCard } from "./_components/team-member-card";
import { TeamMemberRow } from "./_components/team-member-row";
import { TeamMemberRole } from "@/types/team";

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

  // Loading state
  if (teamMembers === undefined) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-4 text-base-content/60">Loading team members...</p>
        </div>
      </div>
    );
  }

  // Error state (empty data)
  if (!teamMembers) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <span className="iconify lucide--alert-circle size-16 text-error mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to load team members</h3>
          <p className="text-base-content/60 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Manage your team members and permissions
          </p>
        </div>
        <Button className="btn btn-primary gap-2" onClick={() => setIsModalOpen(true)}>
          <span className="iconify lucide--user-plus size-5" />
          Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats shadow border border-base-300">
          <div className="stat py-4">
            <div className="stat-title text-xs">Total Members</div>
            <div className="stat-value text-2xl">{stats.total}</div>
          </div>
        </div>
        <div className="stats shadow border border-base-300">
          <div className="stat py-4">
            <div className="stat-title text-xs">Online</div>
            <div className="stat-value text-2xl text-success">{stats.online}</div>
          </div>
        </div>
        <div className="stats shadow border border-base-300">
          <div className="stat py-4">
            <div className="stat-title text-xs">Departments</div>
            <div className="stat-value text-2xl">{stats.departments}</div>
          </div>
        </div>
        <div className="stats shadow border border-base-300">
          <div className="stat py-4">
            <div className="stat-title text-xs">Avg Projects</div>
            <div className="stat-value text-2xl">{stats.avgProjects}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="input input-bordered flex items-center gap-2">
            <span className="iconify lucide--search size-4 text-base-content/60" />
            <input
              type="text"
              className="grow"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>
        <select
          className="select select-bordered w-full sm:w-40"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as TeamMemberRole | "all")}
        >
          <option value="all">All Roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="member">Member</option>
        </select>
        <select
          className="select select-bordered w-full sm:w-48"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <div className="join">
          <Button
            className={`btn join-item ${viewMode === "grid" ? "btn-active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <span className="iconify lucide--layout-grid size-4" />
          </Button>
          <Button
            className={`btn join-item ${viewMode === "table" ? "btn-active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <span className="iconify lucide--table size-4" />
          </Button>
        </div>
      </div>

      {/* Team Members Grid/Table */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <span className="iconify lucide--users-round size-16 text-base-content/20 mb-4" />
          <h3 className="text-lg font-medium mb-2">No team members found</h3>
          <p className="text-base-content/60 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <TeamMemberCard key={member._id} member={member} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Contact & Skills</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-center">Projects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <TeamMemberRow key={member._id} member={member} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Team Member Modal */}
      <NewTeamMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
