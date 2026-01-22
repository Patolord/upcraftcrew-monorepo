"use client";

import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightIcon, CheckIcon, XIcon } from "lucide-react";
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
    <div className="flex flex-col border-t rounded-2xl border border-border p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <p className="mt-4 text-xl font-semibold text-primary">{price}</p>

      <div className="mt-6">
        <div className="mt-3 space-y-2">
          {includes.map((item, index) => (
            <div className="flex items-start gap-2" key={index}>
              {item.included ? (
                <CheckIcon className="mt-0.5 size-4.5 shrink-0 text-green-600 dark:text-green-400" />
              ) : (
                <XIcon className="mt-0.5 size-4.5 shrink-0 text-muted-foreground/40" />
              )}
              <span className={`text-sm ${item.included ? "" : "text-muted-foreground"}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground mt-auto pt-6 text-center text-sm italic">{tagline}</p>

      <a
        href="https://api.whatsapp.com/send/?phone=11914246379&text&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <Button className="w-full group/btn mt-4 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all">
          <span>{customCta || cta}</span>
          <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
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
      className="group/section container bg-muted/25 py-8 md:py-12 lg:py-16 2xl:py-28"
      id={SECTION_IDS.pricing}
    >
      <div className="flex items-center justify-center gap-1.5">
        <div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
        <p className="text-muted-foreground group-hover/section:text-primary font-mono text-sm font-medium transition-all">
          {pricing.eyebrow}
        </p>
        <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
      </div>
      <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{pricing.title}</p>

      {/* Tabs */}
      <div className="flex justify-center items-center mt-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabKey)}
          className="w-fit"
        >
          <TabsList className="flex flex-wrap justify-center gap-1.5 rounded-full p-1.5 h-auto">
            {tabKeys.map((tabKey) => (
              <TabsTrigger
                key={tabKey}
                value={tabKey}
                className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {pricing.tabs[tabKey]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
