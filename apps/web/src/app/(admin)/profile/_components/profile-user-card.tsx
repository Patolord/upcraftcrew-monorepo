"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "./edit-profile-dialog";
import { Facebook, Instagram, Twitter } from "lucide-react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  phone?: string;
  age?: number;
  location?: string;
  bio?: string;
  role: "admin" | "member" | "viewer";
  department?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

interface ProfileUserCardProps {
  user: User;
}

export function ProfileUserCard({ user }: ProfileUserCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fullName = `${user.firstName} ${user.lastName}`;
  const userInitials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;

  // Role display mapping
  const roleConfig = {
    admin: { label: "Admin", color: "bg-orange-500 text-white" },
    member: { label: "Member", color: "bg-blue-500 text-white" },
    viewer: { label: "Viewer", color: "bg-gray-500 text-white" },
  };

  const roleDisplay = roleConfig[user.role];

  return (
    <>
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side - Avatar and basic info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {/* Avatar with orange ring */}
                <Avatar className="size-24 ring-4 ring-orange-200 ring-offset-2">
                  <AvatarImage src={user.imageUrl ?? ""} alt={fullName} />
                  <AvatarFallback className="bg-orange-400 text-white text-2xl font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                {/* Name and role */}
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">{fullName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {user.department || roleDisplay.label}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-border" />

            {/* Right side - Contact info */}
            <div className="flex-1 space-y-4">
              {/* Email */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-20">Email:</span>
                <span className="text-sm text-orange-500">{user.email}</span>
              </div>

              {/* Mobile */}
              {user.phone && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">Mobile:</span>
                  <span className="text-sm text-foreground">{user.phone}</span>
                </div>
              )}

              {/* Age */}
              {user.age && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">Age:</span>
                  <span className="text-sm text-foreground">{user.age}</span>
                </div>
              )}

              {/* Location */}
              {user.location && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">Location:</span>
                  <span className="text-sm text-foreground">{user.location}</span>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-20">Social:</span>
                <div className="flex items-center gap-2">
                  {user.socialLinks?.facebook && (
                    <a
                      href={user.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center size-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Facebook className="size-4" />
                    </a>
                  )}
                  {user.socialLinks?.instagram && (
                    <a
                      href={user.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center size-8 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors"
                    >
                      <Instagram className="size-4" />
                    </a>
                  )}
                  {user.socialLinks?.twitter && (
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center size-8 rounded-full bg-sky-400 text-white hover:bg-sky-500 transition-colors"
                    >
                      <Twitter className="size-4" />
                    </a>
                  )}
                  {!user.socialLinks?.facebook &&
                    !user.socialLinks?.instagram &&
                    !user.socialLinks?.twitter && (
                      <span className="text-sm text-muted-foreground">Not set</span>
                    )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setIsEditDialogOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6"
                >
                  Edit info
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentData={{
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          age: user.age,
          location: user.location,
          bio: user.bio,
          socialLinks: user.socialLinks,
        }}
      />
    </>
  );
}
