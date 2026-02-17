export const SUPPORTED_LOCALES = ["en", "pt"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const SECTION_IDS = {
  hero: "hero",
  portfolio: "portfolio",
  features: "features",
  process: "process",
  benefits: "benefits",
  caseStudies: "case-studies",
  leadMagnet: "lead-magnet",
  pricing: "pricing",
  contact: "contact",
} as const;

export type SectionId = keyof typeof SECTION_IDS;
