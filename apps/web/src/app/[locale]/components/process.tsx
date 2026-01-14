"use client";

import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
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
        <div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        <p className="text-base-content/60 group-hover:text-primary font-mono text-sm font-medium transition-all">
          {process.eyebrow}
        </p>
        <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
      <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{process.title}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12 lg:mt-16 xl:grid-cols-4 2xl:mt-16">
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="bg-base-200/60 border-base-200 rounded-full border p-3">
              <ZapIcon className="size-6" />
            </div>
          </div>
          <div className="card bg-base-200/60 border-base-200 mt-4 flex-1 border p-5">
            <p className="text-center text-lg font-medium">{discovery.title}</p>
            <p className="text-base-content/60 mt-1 text-center text-sm italic">
              {discovery.subtitle}
            </p>
            <div className="mt-6 space-y-1.5 space-x-1.5">
              {discovery.items?.map((item, index) => (
                <div
                  key={item}
                  className="bg-base-100 rounded-box border-base-200 inline-flex items-center gap-2 border px-3 py-1.5"
                >
                  <span className={`iconify ${discoveryIcons[index]} size-4`}></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <p className="text-primary text-center text-xs font-semibold uppercase tracking-wider">
              {discovery.stepLabel}
            </p>
            <ArrowRightIcon className="size-5 text-primary hidden xl:block" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="from-primary to-secondary text-primary-content rounded-full border border-transparent bg-linear-to-br p-3">
              <SettingsIcon className="size-6" />
            </div>
          </div>
          <div className="card from-primary to-secondary text-primary-content mt-4 flex-1 bg-linear-to-br p-5">
            <p className="text-center text-lg font-medium">{development.title}</p>
            <p className="text-primary-content/60 mt-1 text-center text-sm italic">
              {development.subtitle}
            </p>

            <div className="mt-10 text-center">
              <SparklesIcon className="size-16 text-white/40" />
            </div>
            <div className="mt-10 flex flex-col items-center space-y-1.5 [--color-base-100:#ffffff66]">
              <div className="flex items-center gap-2">
                <div className="skeleton h-1.5 w-24 bg-white/20"></div>
                <div className="skeleton h-1.5 w-8 bg-white/20"></div>
              </div>
              <div className="skeleton h-1.5 w-50 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <div className="skeleton h-1.5 w-8 bg-white/20"></div>
                <div className="skeleton h-1.5 w-16 bg-white/20"></div>
                <div className="skeleton h-1.5 w-12 bg-white/20"></div>
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
            <div className="from-primary to-secondary rounded-full border border-transparent bg-linear-to-br p-0.5">
              <div className="bg-base-100 rounded-full p-2.5">
                <SparklesIcon className="size-6" />
              </div>
            </div>
          </div>
          <div className="from-primary to-secondary card mt-4 flex-1 bg-linear-to-br p-1">
            <div className="bg-base-100 rounded-box flex h-full flex-col p-5">
              <p className="text-center text-lg font-medium">{testing.title}</p>
              <p className="text-base-content/60 mt-1 text-center text-sm italic">
                {testing.subtitle}
              </p>
              <div className="mt-5 space-y-2 space-x-2">
                {testing.items?.map((item, index) => (
                  <div
                    key={item}
                    className="border-base-200 rounded-box inline-flex items-center gap-2 border px-2.5 py-1"
                  >
                    <span className={`iconify ${testingIcons[index]} size-4`}></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <p className="text-primary text-center text-xs font-semibold uppercase tracking-wider">
              {testing.stepLabel}
            </p>
            <ArrowRightIcon className="size-5 text-primary hidden xl:block" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="border-base-300 bg-base-100 rounded-full border border-dashed p-3">
              <UserCogIcon className="size-6" />
            </div>
          </div>
          <div className="card border-base-300 mt-4 flex-1 border border-dashed p-5">
            <p className="text-center text-lg font-medium">{support.title}</p>
            <p className="text-base-content/60 mt-1 text-center text-sm italic">
              {support.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {support.items?.map((item, index) => (
                <button
                  key={item}
                  className={`btn btn-sm gap-2 ${
                    index < supportIcons.length ? "btn-soft btn-primary" : "btn-ghost btn-primary"
                  }`}
                >
                  {index < supportIcons.length ? (
                    <span className={`iconify ${supportIcons[index]} size-4`}></span>
                  ) : null}
                  {item}
                </button>
              ))}
            </div>
          </div>
          <p className="text-primary mt-3 text-center text-xs font-semibold uppercase tracking-wider">
            {support.stepLabel}
          </p>
        </div>
      </div>
    </div>
  );
};
