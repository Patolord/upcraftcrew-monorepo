/**
 * Design System Colors - Synchronized with Web
 * Brand color: #ff8e29 (orange)
 */

export const colors = {
  // Brand
  brand: "#ff8e29",
  brandForeground: "#ffffff",

  // Light mode
  light: {
    background: "#ffffff",
    foreground: "#1a1a1a",
    adminBackground: "#fff4ea",
    card: "#ffffff",
    cardForeground: "#1a1a1a",
    primary: "#1a1a1a",
    primaryForeground: "#fafafa",
    secondary: "#f5f5f5",
    secondaryForeground: "#1a1a1a",
    muted: "#f5f5f5",
    mutedForeground: "#737373",
    accent: "#f5f5f5",
    accentForeground: "#1a1a1a",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#e5e5e5",
    input: "#e5e5e5",
    ring: "#a3a3a3",
    success: "#22c55e",
  },

  // Dark mode
  dark: {
    background: "#1a1a1a",
    foreground: "#fafafa",
    adminBackground: "#1a1a1a",
    card: "#262626",
    cardForeground: "#fafafa",
    primary: "#e5e5e5",
    primaryForeground: "#1a1a1a",
    secondary: "#404040",
    secondaryForeground: "#fafafa",
    muted: "#404040",
    mutedForeground: "#a3a3a3",
    accent: "#525252",
    accentForeground: "#fafafa",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#404040",
    input: "#404040",
    ring: "#737373",
    success: "#22c55e",
  },

  // Semantic colors
  status: {
    online: "#22c55e",
    offline: "#9ca3af",
    away: "#eab308",
    busy: "#ef4444",
  },

  // Stat card colors
  stats: {
    teal: "#14b8a6",
    blue: "#3b82f6",
    orange: "#f97316",
    orangeLight: "#fb923c",
    purple: "#8b5cf6",
    pink: "#ec4899",
    green: "#22c55e",
    red: "#ef4444",
    yellow: "#eab308",
  },

  // Priority colors
  priority: {
    low: "#22c55e",
    medium: "#3b82f6",
    high: "#f59e0b",
    urgent: "#ef4444",
  },

  // Project status colors
  projectStatus: {
    planning: "#6366f1",
    "in-progress": "#f97316",
    completed: "#22c55e",
    onHold: "#9ca3af",
  },

  // Transaction colors
  transaction: {
    income: "#22c55e",
    expense: "#ef4444",
    pending: "#f59e0b",
  },

  // Chart colors
  chart: {
    1: "#8b5cf6",
    2: "#6366f1",
    3: "#4f46e5",
    4: "#4338ca",
    5: "#3730a3",
  },
} as const;

export type Colors = typeof colors;
