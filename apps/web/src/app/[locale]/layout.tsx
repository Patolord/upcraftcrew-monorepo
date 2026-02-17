import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { LandingI18nProvider } from "./providers/landing-i18n-provider";
import { SUPPORTED_LOCALES, type SupportedLocale } from "./constants";

type Params = Promise<{ locale: string }>;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: "Upcraft Crew — We Fix Delivery Bottlenecks in Codebases",
    pt: "Upcraft Crew — Resolvemos Gargalos de Entrega em Codebases",
  };

  const descriptions = {
    en: "Team afraid to ship? Slow queries? Regressions every release? We fix delivery bottlenecks across Convex, Supabase, Next.js, WordPress, and more.",
    pt: "Equipe com medo de entregar? Queries lentas? Regressões em toda release? Resolvemos gargalos de entrega em Convex, Supabase, Next.js, WordPress e mais.",
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
