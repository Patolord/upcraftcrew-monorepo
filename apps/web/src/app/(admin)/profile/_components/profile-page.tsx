"use client";

import { useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileHeader } from "./profile-header";
import { EditProfileDialog } from "./edit-profile-dialog";
import React from "react";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CakeIcon,
  TwitterIcon,
  InstagramIcon,
  FacebookIcon,
  UserIcon,
} from "lucide-react";

interface ProfilePageProps {
  preloadedUser: Preloaded<typeof api.users.current>;
}

export function ProfilePage({ preloadedUser }: ProfilePageProps) {
  const user = usePreloadedQuery(preloadedUser);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <ProfileHeader />
        <Card className="rounded-lg">
          <CardContent className="p-8">
            <p className="text-center text-muted-foreground">No user data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    <div className="p-6 space-y-6">
      <ProfileHeader />

      {/* Profile Card */}
      <Card className="rounded-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Large Avatar */}
              <Avatar className="size-24">
                <AvatarImage src={user.imageUrl} alt={fullName} />
                <AvatarFallback className="bg-orange-500 text-white text-2xl font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">{fullName}</h2>
                  <Badge className={roleDisplay.color}>{roleDisplay.label}</Badge>
                </div>
                {user.bio && <p className="text-sm text-muted-foreground max-w-2xl">{user.bio}</p>}
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Edit Info
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-full bg-orange-100 text-orange-600">
                  <MailIcon className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>

              {/* Mobile */}
              {user.phone && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-full bg-blue-100 text-blue-600">
                    <PhoneIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mobile</p>
                    <p className="text-sm font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              {/* Age */}
              {user.age && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-full bg-purple-100 text-purple-600">
                    <CakeIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="text-sm font-medium">{user.age}</p>
                  </div>
                </div>
              )}

              {/* Location */}
              {user.location && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-full bg-green-100 text-green-600">
                    <MapPinIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{user.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links Section */}
            {user.socialLinks && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Social Links</h3>

                {/* Twitter */}
                {user.socialLinks.twitter && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-sky-100 text-sky-600">
                      <TwitterIcon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Twitter</p>
                      <a
                        href={user.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-sky-600 hover:underline truncate block"
                      >
                        {user.socialLinks.twitter}
                      </a>
                    </div>
                  </div>
                )}

                {/* Instagram */}
                {user.socialLinks.instagram && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-pink-100 text-pink-600">
                      <InstagramIcon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Instagram</p>
                      <a
                        href={user.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-pink-600 hover:underline truncate block"
                      >
                        {user.socialLinks.instagram}
                      </a>
                    </div>
                  </div>
                )}

                {/* Facebook */}
                {user.socialLinks.facebook && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-blue-100 text-blue-600">
                      <FacebookIcon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Facebook</p>
                      <a
                        href={user.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:underline truncate block"
                      >
                        {user.socialLinks.facebook}
                      </a>
                    </div>
                  </div>
                )}

                {/* Show placeholder if no social links */}
                {!user.socialLinks.twitter &&
                  !user.socialLinks.instagram &&
                  !user.socialLinks.facebook && (
                    <div className="text-sm text-muted-foreground py-4">
                      No social links added yet. Click &quot;Edit Info&quot; to add your social
                      profiles.
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Additional Info Section */}
          {user.department && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-foreground mb-4">Team Information</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-full bg-indigo-100 text-indigo-600">
                  <UserIcon className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{user.department}</p>
                </div>
              </div>
              {user.skills && user.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
    </div>
  );
}
