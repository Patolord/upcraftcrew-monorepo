"use client";

import { useMemo, useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { NewTeamMemberModal } from "./new-team-member-modal";
import { TeamMemberCard } from "./team-member-card";
import { UserDetailPanel } from "./user-detail-panel";
import { UsersRoundIcon, PlusIcon, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { TeamHeader } from "./team-header";
import { TeamStats } from "./team-stats";
import { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React from "react";

type TeamMemberWithProjects = Doc<"users"> & {
  projects: (Doc<"projects"> | null)[];
};

interface TeamPageProps {
  preloadedTeam: Preloaded<typeof api.team.getTeamMembers>;
}

const ITEMS_PER_PAGE = 3;

export function TeamPage({ preloadedTeam }: TeamPageProps) {
  const teamMembers = usePreloadedQuery(preloadedTeam);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMemberWithProjects | null>(null);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!teamMembers) {
      return [];
    }

    return teamMembers.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.department || "").toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [teamMembers, searchQuery]);

  // Get visible members
  const visibleMembers = useMemo(() => {
    return filteredMembers.slice(0, visibleItems);
  }, [filteredMembers, visibleItems]);

  const canLoadMore = visibleItems < filteredMembers.length;

  // Reset visible items when search changes
  useMemo(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [searchQuery]);

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="p-4 md:p-6 md:pl-12 md:pr-12 space-y-4 md:space-y-6">
      <TeamHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Stats Cards */}
      <TeamStats teamMembers={(teamMembers || []) as TeamMemberWithProjects[]} />

      {/* Our Team Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">Our Team</h2>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 sm:px-6 text-sm w-full sm:w-auto"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Cards Grid */}
        <div className={selectedMember ? "lg:col-span-2" : "lg:col-span-3"}>
          {!teamMembers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <EmptyState
                icon={UsersRoundIcon}
                title="No team members found"
                description="Try adjusting your search or add a new team member"
              />
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 ${selectedMember ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"} gap-3 md:gap-4`}
              >
                {visibleMembers.map((member) => (
                  <TeamMemberCard key={member._id} member={member} onSelect={setSelectedMember} />
                ))}
              </div>

              {/* Load More Button */}
              {canLoadMore && (
                <div className="flex justify-center pt-6">
                  <Button onClick={handleLoadMore} variant="outline" className="min-w-[150px]">
                    Ver Mais
                  </Button>
                </div>
              )}

              {!canLoadMore && filteredMembers.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center pt-4">
                  <p className="text-sm text-muted-foreground">Todos os membros foram carregados</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column - User Detail Panel */}
        {selectedMember && (
          <div className="lg:col-span-1">
            <UserDetailPanel member={selectedMember} />
          </div>
        )}
      </div>

      {/* New Team Member Modal */}
      <NewTeamMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
