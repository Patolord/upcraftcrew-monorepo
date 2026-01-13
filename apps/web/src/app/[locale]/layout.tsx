import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { LandingI18nProvider } from "./providers/landing-i18n-provider";

export const SUPPORTED_LOCALES = ["en", "pt"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

type Params = Promise<{ locale: string }>;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: "UpCraftCrew - Web Development & Software Solutions",
    pt: "UpCraftCrew - Desenvolvimento de Websites e Aplicativos",
  };

  const descriptions = {
    en: "Boutique software studio specializing in React, Next.js, and modern cloud solutions. High-quality web development delivered seamlessly.",
    pt: "Estúdio boutique especializado em React, Next.js e soluções modernas em nuvem. Desenvolvimento web de alta qualidade entregue com fluidez.",
  };

  return {
    title: titles[locale as SupportedLocale] || titles.en,
    description: descriptions[locale as SupportedLocale] || descriptions.en,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        pt: "/pt",
      },
    },
  };
}

const LocaleLayout = async ({ children, params }: { children: ReactNode; params: Params }) => {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  return <LandingI18nProvider locale={locale as SupportedLocale}>{children}</LandingI18nProvider>;
};

export default LocaleLayout;
