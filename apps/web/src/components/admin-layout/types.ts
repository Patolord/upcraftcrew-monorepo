export type ISidebarMenuItem = {
  id: string;
  label: string;
  url?: string;
  icon?: string;
  children?: ISidebarMenuItem[];
  isTitle?: boolean;
  badges?: string[];
  linkProp?: {
    target?: string;
  };
};
