"use client";

import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightIcon, SettingsIcon, SparklesIcon, ZapIcon, UserCogIcon } from "lucide-react";

export const Process = () => {
  const { messages } = useLandingI18n();
  const { process } = messages;
  const [discovery, development, testing, support] = process.steps;

  const discoveryIcons = ["UsersIcon", "LayoutIcon", "CalendarIcon", "FileTextIcon"] as const;
  const testingIcons = [
    "CheckCircleIcon",
    "CloudUploadIcon",
    "ShieldCheckIcon",
    "RocketIcon",
  ] as const;
  const supportIcons = [
    "MonitorIcon",
    "RefreshCwIcon",
    "ShieldIcon",
    "HelpCircleIcon",
    "TrendingUpIcon",
    "CodeIcon",
  ] as const;

  return (
    <div className="group container py-8 md:py-12 lg:py-12 2xl:py-2" id={SECTION_IDS.process}>
      <div className="flex items-center justify-center gap-1.5">
        <div className="bg-orange-500 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        <p className="text-muted-foreground group-hover:text-primary font-mono text-sm font-medium transition-all">
          {process.eyebrow}
        </p>
        <div className="bg-orange-500 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
      <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{process.title}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12 lg:mt-16 xl:grid-cols-4 2xl:mt-16">
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="bg-muted/60 border-orange-500 rounded-full border p-3">
              <ZapIcon className="size-6" />
            </div>
          </div>
          <div className="rounded-lg bg-muted/60 border-border mt-4 flex-1 border p-5">
            <p className="text-center text-lg font-medium">{discovery.title}</p>
            <p className="text-muted-foreground mt-1 text-center text-sm italic">
              {discovery.subtitle}
            </p>
            <div className="mt-6 space-y-1.5 space-x-1.5">
              {discovery.items?.map((item, index) => (
                <div
                  key={item}
                  className="bg-background rounded-lg border-border inline-flex items-center gap-2 border px-3 py-1.5"
                >
                  <span className={`iconify ${discoveryIcons[index]} size-4`}></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <p className="text-orange-500 text-center text-xs font-semibold uppercase tracking-wider">
              {discovery.stepLabel}
            </p>
            <ArrowRightIcon className="size-5 text-orange-500 hidden xl:block" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className=" text-primary rounded-full border border-orange-500 p-3">
              <SettingsIcon className="size-6" />
            </div>
          </div>
          <div className="rounded-lg from-orange-300 to-orange-500 text-primary-foreground mt-4 flex-1 bg-linear-to-br p-5">
            <p className="text-center text-lg font-medium">{development.title}</p>
            <p className="text-primary-foreground/60 mt-1 text-center text-sm italic">
              {development.subtitle}
            </p>

            <div className="mt-10 text-center">
              <SparklesIcon className="size-16 text-white/50" />
            </div>
            <div className="mt-10 flex flex-col items-center space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-1.5 w-24 rounded-lg bg-white/40" />
                <Skeleton className="h-1.5 w-8 rounded-lg bg-white/40" />
              </div>
              <Skeleton className="h-1.5 w-50 rounded-lg bg-white/40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-1.5 w-8 rounded-lg bg-white/40" />
                <Skeleton className="h-1.5 w-16 rounded-lg bg-white/40" />
                <Skeleton className="h-1.5 w-12 rounded-lg bg-white/40" />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <p className="text-primary text-center text-xs font-semibold uppercase tracking-wider">
              {development.stepLabel}
            </p>
            <ArrowRightIcon className="size-5 text-primary hidden xl:block" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="from-orange-500 to-orange-600 rounded-full border border-transparent bg-linear-to-br p-0.5">
              <div className="bg-background rounded-full p-2.5">
                <SparklesIcon className="size-6" />
              </div>
            </div>
          </div>
          <div className="from-orange-200 to-orange-600 rounded-lg mt-4 flex-1 bg-linear-to-br p-1">
            <div className="bg-background rounded-lg flex h-full flex-col p-5">
              <p className="text-center text-lg font-medium">{testing.title}</p>
              <p className="text-muted-foreground mt-1 text-center text-sm italic">
                {testing.subtitle}
              </p>
              <div className="mt-5 space-y-2 space-x-2">
                {testing.items?.map((item, index) => (
                  <div
                    key={item}
                    className="border-border rounded-lg inline-flex items-center gap-2 border px-2.5 py-1"
                  >
                    <span className={`iconify ${testingIcons[index]} size-4`}></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <p className="text-orange-500 text-center text-xs font-semibold uppercase tracking-wider">
              {testing.stepLabel}
            </p>
            <ArrowRightIcon className="size-5 text-orange-500 hidden xl:block" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className=" bg-background rounded-full border font-bold border-orange-500 p-3">
              <UserCogIcon className="size-6" />
            </div>
          </div>
          <div className="rounded-lg border-border mt-4 flex-1 border border-dashed p-5">
            <p className="text-center text-lg font-medium">{support.title}</p>
            <p className="text-muted-foreground mt-1 text-center text-sm italic">
              {support.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {support.items?.map((item, index) => (
                <Button
                  key={item}
                  size="sm"
                  variant={index < supportIcons.length ? "secondary" : "ghost"}
                  className="gap-2"
                >
                  {index < supportIcons.length ? (
                    <span className={`iconify ${supportIcons[index]} size-4`}></span>
                  ) : null}
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <p className="text-orange-500 mt-3 text-center text-xs font-semibold uppercase tracking-wider">
            {support.stepLabel}
          </p>
        </div>
      </div>
    </div>
  );
};
