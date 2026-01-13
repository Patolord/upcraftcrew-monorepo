// A4 dimensions at 96 DPI
export const A4_WIDTH = 794; // 210mm in pixels at 96dpi
export const A4_HEIGHT = 1123; // 297mm in pixels at 96dpi

// Brand colors
export const COLORS = {
  orange: "#F2994A",
  orangeDark: "#E07A2F",
  grayDark: "#3C3C3C",
  grayMedium: "#4A5568",
  grayLight: "#F0F0F0",
  white: "#FFFFFF",
  divider: "#969696",
} as const;

// Common page styles
export const pageStyles = {
  // Light background page (cover, about, scope)
  light: "bg-[#F0F0F0] text-[#3C3C3C]",
  // Dark background page (index, objectives, investment)
  dark: "bg-[#3C3C3C] text-white",
  // White background page
  white: "bg-white text-[#3C3C3C]",
} as const;

// A4 page container
export const pageContainer = `w-[${A4_WIDTH}px] h-[${A4_HEIGHT}px] relative overflow-hidden`;

// Common section styles
export const sectionTitle = "font-bold uppercase tracking-wide";
export const horizontalDivider = "w-full h-[1px] bg-[#969696]";
