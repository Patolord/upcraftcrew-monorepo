"use client";

import { useMemo, useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewTeamMemberModal } from "./new-team-member-modal";
import { TeamMemberRow } from "./team-member-row";
import { UserDetailPanel } from "./user-detail-panel";
import { UsersRoundIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { TeamHeader } from "./team-header";
import { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React from "react";

type TeamMemberWithProjects = Doc<"users"> & {
  projects: (Doc<"projects"> | null)[];
};

interface TeamPageProps {
  preloadedTeam: Preloaded<typeof api.team.getTeamMembers>;
}

const ITEMS_PER_PAGE = 10;

export function TeamPage({ preloadedTeam }: TeamPageProps) {
  const teamMembers = usePreloadedQuery(preloadedTeam);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMemberWithProjects | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  // Paginate filtered members
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, endIndex);
  }, [filteredMembers, currentPage]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-orange-50/30 to-pink-50/30 dark:from-orange-950/10 dark:to-pink-950/10 min-h-screen">
      <TeamHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Table */}
        <div className={selectedMember ? "lg:col-span-2" : "lg:col-span-3"}>
          {filteredMembers.length === 0 ? (
            <Card className="p-12">
              <EmptyState
                icon={UsersRoundIcon}
                title="No team members found"
                description="Try adjusting your search"
              />
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Country</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMembers.map((member) => (
                      <TeamMemberRow
                        key={member._id}
                        member={member}
                        isSelected={selectedMember?._id === member._id}
                        onSelect={setSelectedMember}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)} of{" "}
                    {filteredMembers.length} products
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeftIcon className="size-4" />
                      Prev
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage <= 2) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNum = totalPages - 2 + i;
                        } else {
                          pageNum = currentPage - 1 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="min-w-9"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {totalPages > 3 && currentPage < totalPages - 1 && (
                        <>
                          <span className="px-2 text-muted-foreground">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            className="min-w-9"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRightIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
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
