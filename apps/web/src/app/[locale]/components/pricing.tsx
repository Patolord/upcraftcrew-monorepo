"use client";

import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { ArrowRightIcon } from "lucide-react";
import { useQueryState, parseAsStringEnum } from "nuqs";

interface PricingCardProps {
  title: string;
  price: string;
  includes: { text: string; included?: boolean }[];
  tagline: string;
  cta: string;
  customCta?: string;
}

const PricingCard = ({ title, price, includes, tagline, cta, customCta }: PricingCardProps) => {
  return (
    <div className="card bg-base-100 flex flex-col rounded-2xl border border-base-300 p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <p className="mt-4 text-xl font-semibold text-primary">{price}</p>

      <div className="mt-6">
        <div className="mt-3 space-y-2">
          {includes.map((item, index) => (
            <div className="flex items-start gap-2" key={index}>
              <span
                className={`iconify mt-0.5 size-4.5 shrink-0 ${
                  item.included ? "CheckIcon text-success" : "XIcon text-base-content/40"
                }`}
              ></span>
              <span className={`text-sm ${item.included ? "" : "text-base-content/60"}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-base-content/70 mt-auto pt-6 text-center text-sm italic">{tagline}</p>

      <a
        href="https://api.whatsapp.com/send/?phone=11914246379&text&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary mt-4 gap-2.5 rounded-full"
      >
        <ArrowRightIcon className="size-4" />
        {customCta || cta}
      </a>
    </div>
  );
};

export const Pricing = () => {
  const { messages } = useLandingI18n();
  const { pricing } = messages;

  const tabKeys = ["websites", "webApps", "mobileApps", "consulting"] as const;
  type TabKey = (typeof tabKeys)[number];

  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringEnum<TabKey>([...tabKeys]).withDefault("websites"),
  );

  const currentPlans = pricing.plans[activeTab] || [];
  const currentCta = pricing.cta[activeTab];

  return (
    <div
      className="group/section container py-8 md:py-12 lg:py-16 2xl:py-28"
      id={SECTION_IDS.pricing}
    >
      <div className="flex items-center justify-center gap-1.5">
        <div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
        <p className="text-base-content/60 group-hover/section:text-primary font-mono text-sm font-medium transition-all">
          {pricing.eyebrow}
        </p>
        <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
      </div>
      <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{pricing.title}</p>

      {/* Tabs */}
      <div className="mt-8 flex justify-center">
        <div
          role="tablist"
          className="tabs bg-gray-200/50 tabs-boxed inline-flex flex-wrap gap-1.5 rounded-full p-1.5"
        >
          {tabKeys.map((tabKey) => (
            <button
              key={tabKey}
              role="tab"
              aria-selected={activeTab === tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`tab rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tabKey
                  ? "tab-active bg-primary text-primary-content shadow-sm"
                  : "hover:bg-base-300/50"
              }`}
            >
              {pricing.tabs[tabKey]}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`mt-8 grid grid-cols-1 gap-6 lg:mt-12 lg:gap-8 ${
          currentPlans.length <= 3
            ? "md:grid-cols-2 lg:grid-cols-3 justify-items-center lg:max-w-5xl lg:mx-auto"
            : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}
      >
        {currentPlans.map((plan, index) => (
          <PricingCard
            key={index}
            title={plan.title}
            price={plan.price}
            includes={plan.includes}
            tagline={plan.tagline}
            cta={currentCta}
            customCta={"customCta" in plan ? plan.customCta : undefined}
          />
        ))}
      </div>
    </div>
  );
};
