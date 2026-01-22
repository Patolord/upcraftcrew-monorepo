"use client";

import Link from "next/link";

import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { WavePath } from "./wave-path";
import {
  ArrowRightIcon,
  ArrowDownIcon,
  CircuitBoardIcon,
  SparklesIcon,
  ZapIcon,
  GaugeIcon,
  DatabaseBackupIcon,
  BellRingIcon,
  BarChart3Icon,
  TrendingUpIcon,
} from "lucide-react";
import Image from "next/image";

export const Hero = () => {
  const { messages } = useLandingI18n();
  const { hero } = messages;

  return (
    <>
      <div className="relative z-2 overflow-hidden lg:h-screen" id={SECTION_IDS.hero}>
        <div className="container flex items-center justify-center pt-20 md:pt-28 xl:pt-36 2xl:pt-48">
          <div className="w-100 text-center md:w-120 xl:w-160 2xl:w-200">
            <div className="flex justify-center">
              <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/5 py-0.5 ps-2.5 pe-1 text-sm">
                {hero.badge.prefix}{" "}
                <span className="ms-1 font-medium text-orange-500">{hero.badge.highlight}</span>
                <div className="ms-2 rounded-full bg-orange-500 p-0.5">
                  <ArrowRightIcon className="size-3 text-white" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-2xl leading-tight font-extrabold tracking-[-0.5px] transition-all duration-1000 md:text-4xl xl:text-5xl 2xl:text-6xl starting:scale-110 starting:blur-md">
              {hero.title.line1}
              <br /> {hero.title.line2}{" "}
              <span className="animate-background-shift from-primary to-secondary bg-linear-to-r bg-[length:400%_400%] bg-clip-text text-transparent">
                {hero.title.highlight}
              </span>
            </p>
            <p className="text-muted-foreground mt-5 xl:text-lg">{hero.description}</p>
            <div className="mt-8 inline-flex justify-center gap-3 transition-all duration-1000 starting:scale-110">
              <Button className="border-orange-500 bg-orange-500 text-white hover:bg-orange-600 h-10 text-md rounded-lg shadow-xl">
                <Link href={`#${SECTION_IDS.pricing}`}>{hero.primaryCta}</Link>
              </Button>
              <Button className="flex gap-2 h-10 bg-white text-foreground hover:border-orange-500 hover:bg-orange-500 text-md hover:text-white rounded-lg border transition-colors">
                <Link href={`#${SECTION_IDS.process}`} className="flex items-center gap-2">
                  <ArrowDownIcon className="size-4" />
                  {hero.secondaryCta}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between max-xl:mt-16">
          <div className="transition-all delay-1400 duration-1000 starting:opacity-0 starting:blur-md">
            <div className="border-orange-400/40 group hover:border-orange-400/80 -ms-1 p-4 rounded-r-4xl border-dashed transition-all max-md:hidden xl:h-120 xl:w-80 xl:border 2xl:h-160 2xl:w-120">
              <div className="relative z-10">
                <div className="bg-background border-orange-400/60 group-hover:border-orange-400/80 rounded-lg w-52 border border-dashed p-4 text-center transition-all xl:absolute xl:end-0 xl:top-20 xl:translate-x-1/2 2xl:top-44">
                  <div className="bg-orange-500/10 text-orange-500 inline-block rounded-full p-2.5">
                    <CircuitBoardIcon className="size-6" />
                  </div>
                  <p className="text-primary mt-1 font-medium">{hero.cards.left.badgeTitle}</p>
                </div>
                <div className="rounded-lg bg-card border shadow absolute end-20 top-68 w-48 p-3 max-2xl:hidden">
                  <div className="flex -space-x-3.5">
                    <div className="relative size-7 rounded-full bg-muted overflow-hidden ring-2 ring-background transition-all hover:-translate-x-2">
                      <Image
                        alt="avatar"
                        src="/images/avatars/1.png"
                        className="size-full object-cover"
                        width={28}
                        height={28}
                      />
                    </div>
                    <div className="relative size-7 rounded-full bg-muted overflow-hidden ring-2 ring-background transition-all hover:-translate-x-2">
                      <Image
                        alt="avatar"
                        src="/images/avatars/2.png"
                        className="size-full object-cover"
                        width={28}
                        height={28}
                      />
                    </div>
                    <div className="relative size-7 rounded-full bg-muted overflow-hidden ring-2 ring-background transition-all hover:-translate-x-2">
                      <Image
                        alt="avatar"
                        src="/images/avatars/3.png"
                        className="size-full object-cover"
                        width={28}
                        height={28}
                      />
                    </div>
                    <div className="relative size-7 rounded-full bg-muted overflow-hidden ring-2 ring-background transition-all hover:-translate-x-2">
                      <Image
                        alt="avatar"
                        src="/images/avatars/4.png"
                        className="size-full object-cover"
                        width={28}
                        height={28}
                      />
                    </div>
                  </div>
                  <p className="text-primary mt-1 font-medium">
                    {hero.cards.left.secondaryCard.title}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {hero.cards.left.secondaryCard.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-1 grow transition-all delay-500 duration-1000 sm:delay-2000 lg:mt-3 xl:mt-24 2xl:mt-47 starting:scale-120 starting:opacity-0 starting:blur-md">
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="bg-orange-400 text-white shadow-orange-500/20 inline-block rounded-full p-4 shadow-lg">
                <SparklesIcon className="size-7" />
              </div>

              <div className="from-orange-300 to-orange-600 text-white rounded-lg w-60 bg-linear-to-r p-4">
                <p className="text-center font-medium">{hero.cards.center.highlight}</p>
              </div>
            </div>
            <div className="absolute -start-8 -end-8 top-0 -z-1 md:-start-6 md:-end-6">
              <WavePath />
            </div>
          </div>
          <div className="transition-all delay-1400 duration-1000 starting:opacity-0 starting:blur-md">
            <div className="border-orange-400/40 hover:border-orange-400/80 group -me-1 rounded-s-4xl border-dashed transition-all max-md:hidden xl:h-120 xl:w-80 xl:border 2xl:h-160 2xl:w-120">
              <div className="xl:relative">
                <div className="bg-background border-orange-400/60 rounded-lg group-hover:border-orange-400/80 w-52 border border-dashed p-4 text-center transition-all xl:absolute xl:start-0 xl:top-20 xl:-translate-x-1/2 xl:border 2xl:top-44">
                  <div className="bg-orange-400/5 text-orange-400 inline-block rounded-full p-2.5">
                    <ZapIcon className="size-6" />
                  </div>
                  <p className="text-orange-400 mt-1 font-medium">{hero.cards.right.badgeTitle}</p>
                </div>
                <div className="rounded-lg bg-card border shadow absolute start-20 top-70 p-3 max-2xl:hidden">
                  <p className="text-muted-foreground text-sm">
                    {hero.cards.right.resources.usage}
                  </p>
                  <div className="mt-0.5 flex gap-1">
                    <Progress value={100} className="h-1" />
                    <Progress value={100} className="h-1" />
                    <Progress value={100} className="h-1" />
                    <Progress value={40} className="h-1" />
                    <Progress value={0} className="h-1" />
                  </div>
                  <div className="text-muted-foreground mt-2.5 flex items-center gap-3 text-sm">
                    <GaugeIcon className="size-4 text-secondary" />
                    {hero.cards.left.performance.label}{" "}
                    <Badge variant="secondary" className="ms-auto text-xs px-1.5 py-0">
                      {hero.cards.left.performance.value}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -start-1 -top-1 delay-500 duration-1000 starting:opacity-0 starting:blur-md">
          <div className="border-border/80 group hover:border-border rounded-br-4xl border max-xl:hidden xl:h-120 xl:w-50 2xl:h-140 2xl:w-70">
            <div className="bg-background border-border/60 group-hover:border-border rounded-lg absolute end-0 w-52 translate-x-1/2 border p-4 text-center transition-all xl:top-40 2xl:top-50">
              <div className="bg-muted inline-block rounded-full p-2.5">
                <DatabaseBackupIcon className="size-6" />
              </div>
              <p className="mt-1 font-medium">{hero.cards.top.title}</p>
            </div>
            <div className="rounded-lg bg-card border shadow absolute start-10 top-40 z-2 overflow-visible max-2xl:hidden">
              <div className="flex items-center gap-3 p-3">
                <div className="bg-muted rounded-full p-2">
                  <BellRingIcon className="size-4" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium italic">
                    {hero.cards.left.email.title}
                  </p>
                  <p className="text-muted-foreground/60 text-xs italic">
                    {hero.cards.left.email.status}
                  </p>
                </div>
                <p className="text-sm font-medium">{hero.cards.left.email.percentage}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -end-1 -top-1 delay-500 duration-1000 starting:opacity-0 starting:blur-md">
          <div className="group rounded-bl-4xl border border-teal-500/40 transition-all hover:border-teal-500/80 max-xl:hidden xl:h-120 xl:w-50 2xl:h-140 2xl:w-70">
            <div className="bg-background rounded-lg absolute start-0 w-52 -translate-x-1/2 border border-teal-500/60 p-4 text-center transition-all group-hover:border-teal-500/80 xl:top-40 2xl:top-50">
              <div className="inline-block rounded-full bg-teal-500/10 p-2.5 text-teal-500">
                <BarChart3Icon className="size-6" />
              </div>
              <p className="mt-1 font-medium text-teal-500">{hero.cards.right.supportCard.title}</p>
            </div>
            <div className="rounded-lg bg-card border shadow absolute start-10 top-40 max-2xl:hidden">
              <div className="flex items-center gap-3 p-3">
                <div className="rounded-full bg-teal-500 p-2 text-white">
                  <TrendingUpIcon className="size-4" />
                </div>
                <div>
                  <Skeleton className="rounded-lg h-2 w-16" />
                  <Skeleton className="rounded-lg mt-1 h-2.5 w-8" />
                </div>
                <p className="text-sm font-medium text-teal-500">
                  {hero.cards.right.supportCard.growth}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-primary/5 absolute -start-20 -bottom-20 -z-1 size-100 rounded-full blur-[150px] max-lg:hidden"></div>
        <div className="bg-secondary/5 absolute end-0 bottom-0 -z-1 size-105 rounded-full blur-[150px] max-lg:hidden"></div>
        <div className="absolute end-0 -top-20 -z-1 size-100 rounded-full bg-teal-300/5 blur-[150px] max-lg:hidden dark:bg-teal-200/5"></div>
      </div>

      <div className="from-primary to-secondary mb-8 h-1 w-full bg-linear-to-r max-xl:mt-6 md:mb-12 xl:mb-16 2xl:mb-28"></div>
    </>
  );
};
