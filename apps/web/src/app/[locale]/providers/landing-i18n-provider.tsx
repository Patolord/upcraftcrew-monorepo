"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import enMessages from "@/app/[locale]/messages/en.json";
import ptMessages from "@/app/[locale]/messages/pt.json";

const messagesMap = {
  en: enMessages,
  pt: ptMessages,
} as const;

export type LandingLocale = keyof typeof messagesMap;
export type LandingMessages = (typeof messagesMap)[LandingLocale];

type LandingI18nContextValue = {
  locale: LandingLocale;
  messages: LandingMessages;
  switchLocale: (nextLocale: LandingLocale) => void;
};

const LandingI18nContext = createContext<LandingI18nContextValue | null>(null);

export const SUPPORTED_LANDING_LOCALES = Object.keys(messagesMap) as LandingLocale[];

export const LandingI18nProvider = ({
  children,
  locale,
}: {
  children: ReactNode;
  locale: LandingLocale;
}) => {
  const pathname = usePathname();

  const switchLocale = useCallback(
    (nextLocale: LandingLocale) => {
      // Replace the locale segment in the path
      const segments = pathname.split("/");
      segments[1] = nextLocale;
      const newPath = segments.join("/") || `/${nextLocale}`;
      window.location.href = newPath;
    },
    [pathname],
  );

  const value = useMemo<LandingI18nContextValue>(
    () => ({
      locale,
      messages: messagesMap[locale],
      switchLocale,
    }),
    [locale, switchLocale],
  );

  return <LandingI18nContext.Provider value={value}>{children}</LandingI18nContext.Provider>;
};

export const useLandingI18n = () => {
  const context = useContext(LandingI18nContext);
  if (!context) {
    throw new Error("useLandingI18n must be used within LandingI18nProvider");
  }
  return context;
};
