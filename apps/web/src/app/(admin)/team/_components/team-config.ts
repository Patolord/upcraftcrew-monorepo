export const roleConfig = {
  owner: {
    label: "Proprietário",
    variant: "destructive" as const,
  },
  admin: {
    label: "Administrador",
    variant: "warning" as const,
  },
  manager: {
    label: "Gerente",
    variant: "default" as const,
  },
  developer: {
    label: "Desenvolvedor",
    variant: "default" as const,
  },
  designer: {
    label: "Designer",
    variant: "secondary" as const,
  },
  member: {
    label: "Membro",
    variant: "outline" as const,
  },
  viewer: {
    label: "Visualizador",
    variant: "outline" as const,
  },
};

export const statusConfig = {
  online: {
    label: "Conectado",
    color: "bg-green-500",
    textColor: "text-green-600 dark:text-green-500",
  },
  away: {
    label: "Ausente",
    color: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-500",
  },
  busy: {
    label: "Ocupado",
    color: "bg-red-500",
    textColor: "text-red-600 dark:text-red-500",
  },
  offline: {
    label: "Desconectado",
    color: "bg-muted",
    textColor: "text-muted-foreground",
  },
};
