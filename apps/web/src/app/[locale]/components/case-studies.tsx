"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";

import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import {
  BuildingIcon,
  ChevronRightIcon,
  ClockIcon,
  LayersIcon,
  TrendingUpIcon,
} from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 14 },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export const CaseStudies = () => {
  const { messages } = useLandingI18n();
  const { caseStudies } = messages;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div
      className="group/section container scroll-mt-12 py-8 md:py-12 lg:py-16 2xl:py-28"
      id={SECTION_IDS.caseStudies}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-1.5">
        <div className="h-4 w-0.5 translate-x-1.5 rounded-full bg-orange-500 opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
        <p className="font-mono text-sm font-medium text-muted-foreground transition-all group-hover/section:text-primary">
          {caseStudies.eyebrow}
        </p>
        <div className="h-4 w-0.5 -translate-x-1.5 rounded-full bg-orange-500 opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
      </div>
      <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{caseStudies.title}</p>
      <div className="mt-2 flex justify-center text-center">
        <p className="max-w-lg text-muted-foreground">{caseStudies.description}</p>
      </div>

      {/* Case Study Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-3"
      >
        {caseStudies.items.map((study, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
            >
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-orange-600" />

              <div className="flex flex-1 flex-col p-6">
                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BuildingIcon className="size-4 text-orange-500" />
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {study.industry}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                      <LayersIcon className="size-3" />
                      {study.band}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ClockIcon className="size-3" />
                      {study.duration}
                    </span>
                  </div>
                </div>

                {/* Company */}
                <h3 className="mt-4 text-lg font-semibold">{study.company}</h3>

                {/* Situation / Problem */}
                <div className="mt-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">{study.situation}</p>
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-orange-500 transition-colors hover:text-orange-600"
                  >
                    {isExpanded ? caseStudies.showLess : caseStudies.readMore}
                    <ChevronRightIcon
                      className={`size-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-destructive/80">
                        {caseStudies.problemLabel}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{study.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                        {caseStudies.solutionLabel}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{study.solution}</p>
                    </div>
                  </div>
                )}

                {/* Results */}
                <div className="mt-auto pt-5">
                  <div className="rounded-xl border border-dashed border-orange-500/30 bg-orange-500/5 p-4">
                    <div className="mb-2 flex items-center gap-1.5">
                      <TrendingUpIcon className="size-3.5 text-orange-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                        {caseStudies.resultsLabel}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {study.results.map((result, rIdx) => (
                        <div key={rIdx} className="text-center">
                          <p className="text-lg font-bold text-foreground">{result.metric}</p>
                          <p className="text-[11px] leading-tight text-muted-foreground">
                            {result.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
