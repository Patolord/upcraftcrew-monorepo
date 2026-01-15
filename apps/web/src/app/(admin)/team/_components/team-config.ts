export const roleConfig = {
  owner: {
    label: "Owner",
    variant: "destructive" as const,
  },
  admin: {
    label: "Admin",
    variant: "warning" as const,
  },
  manager: {
    label: "Manager",
    variant: "default" as const,
  },
  developer: {
    label: "Developer",
    variant: "default" as const,
  },
  designer: {
    label: "Designer",
    variant: "secondary" as const,
  },
  member: {
    label: "Member",
    variant: "outline" as const,
  },
  viewer: {
    label: "Viewer",
    variant: "outline" as const,
  },
};

export const statusConfig = {
  online: {
    label: "Online",
    color: "bg-green-500",
    textColor: "text-green-600 dark:text-green-500",
  },
  away: {
    label: "Away",
    color: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-500",
  },
  busy: {
    label: "Busy",
    color: "bg-red-500",
    textColor: "text-red-600 dark:text-red-500",
  },
  offline: {
    label: "Offline",
    color: "bg-muted",
    textColor: "text-muted-foreground",
  },
};
