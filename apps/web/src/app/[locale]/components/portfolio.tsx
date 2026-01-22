"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";

import { SECTION_IDS } from "../constants";
import { useLandingI18n } from "../providers/landing-i18n-provider";
import { useQueryState, parseAsString } from "nuqs";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const AUTO_PLAY_INTERVAL = 2300;
const TRANSITION_MS = 320;
const accentBadgeClasses = [
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary",
  "bg-accent/10 text-accent",
];

const accentIconClasses = ["SparklesIcon", "RocketIcon", "WorkflowIcon"];

export const Portfolio = () => {
  const { messages, locale } = useLandingI18n();
  const { portfolio } = messages;
  const allProjects = portfolio.projects;

  // Get unique industries that have projects - using actual industry values from projects
  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(allProjects.map((p) => p.industry))];
    return [portfolio.filters.all, ...uniqueIndustries];
  }, [allProjects, portfolio.filters.all]);

  const [selectedIndustry, setSelectedIndustry] = useQueryState(
    "sector",
    parseAsString.withDefault(portfolio.filters.all),
  );

  // Filter projects by industry
  const projects = useMemo(() => {
    if (selectedIndustry === portfolio.filters.all) return allProjects;
    return allProjects.filter((p) => p.industry === selectedIndustry);
  }, [allProjects, selectedIndustry, portfolio.filters.all]);

  const totalProjects = projects.length;

  const [visibleCount, setVisibleCount] = useState(3);
  const canNavigate = totalProjects > visibleCount;
  const initialIndex = canNavigate ? visibleCount : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const projectsLoop = useMemo(() => {
    if (!canNavigate) {
      return projects;
    }

    return [...projects.slice(-visibleCount), ...projects, ...projects.slice(0, visibleCount)];
  }, [projects, canNavigate, visibleCount]);

  // Track page visibility to pause autoplay when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // Reset carousel when projects change or visibility changes
  useEffect(() => {
    setIsTransitionEnabled(false);
    setCurrentIndex(initialIndex);
    // Re-enable transition after a frame
    requestAnimationFrame(() => {
      setIsTransitionEnabled(true);
    });
  }, [initialIndex, projects.length, selectedIndustry]);

  const slideWidth = 100 / visibleCount;
  const translatePercentage = currentIndex * slideWidth;

  const trackStyle: CSSProperties = {
    transform: `translateX(-${translatePercentage}%)`,
    transition: isTransitionEnabled
      ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
      : "none",
  };

  const handleNext = useCallback(() => {
    if (!canNavigate) return;
    setCurrentIndex((previous) => previous + 1);
  }, [canNavigate]);

  const handlePrevious = useCallback(() => {
    if (!canNavigate) return;
    setCurrentIndex((previous) => previous - 1);
  }, [canNavigate]);

  const handleDotSelect = useCallback(
    (targetIndex: number) => {
      if (!canNavigate) return;
      setCurrentIndex(initialIndex + targetIndex);
    },
    [initialIndex, canNavigate],
  );

  // Autoplay - only when page is visible, not paused, and can navigate
  useEffect(() => {
    const shouldAutoPlay = totalProjects > visibleCount && !isPaused && isPageVisible;

    if (!shouldAutoPlay) return;

    const intervalId = window.setInterval(() => {
      setCurrentIndex((previous) => previous + 1);
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [totalProjects, visibleCount, isPaused, isPageVisible]);

  useEffect(() => {
    if (!isTransitionEnabled) {
      const id = requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isTransitionEnabled]);

  const handleTransitionEnd = useCallback(() => {
    if (!canNavigate) return;

    if (currentIndex >= totalProjects + visibleCount) {
      setIsTransitionEnabled(false);
      setCurrentIndex((previous) => previous - totalProjects);
      return;
    }

    if (currentIndex < visibleCount) {
      setIsTransitionEnabled(false);
      setCurrentIndex((previous) => previous + totalProjects);
    }
  }, [canNavigate, currentIndex, totalProjects, visibleCount]);

  const baseOffset = canNavigate ? visibleCount : 0;
  const activeDotIndex = canNavigate
    ? (((currentIndex - baseOffset) % totalProjects) + totalProjects) % totalProjects
    : 0;

  const handleMouseEnter = useCallback(() => {
    if (!canNavigate) return;
    setIsPaused(true);
  }, [canNavigate]);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  if (totalProjects === 0) {
    return null;
  }

  return (
    <section
      className="group/section container scroll-mt-12 py-8 md:py-8 lg:py-8 2xl:py-4"
      id={SECTION_IDS.portfolio}
    >
      <div className="flex items-center justify-center gap-1.5">
        <div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
        <p className="text-muted-foreground group-hover/section:text-primary font-mono text-sm font-medium transition-all">
          {portfolio.eyebrow}
        </p>
        <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
      </div>
      <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{portfolio.title}</p>

      {/* Industry Filter */}
      <div className="flex justify-center items-center mt-8">
        <Tabs
          value={selectedIndustry}
          onValueChange={(value) => setSelectedIndustry(value)}
          className="w-fit"
        >
          <TabsList className="flex flex-wrap justify-center gap-1.5 rounded-full bg-muted p-1.5 h-auto">
            {industries.map((industry) => (
              <TabsTrigger
                key={industry}
                value={industry}
                className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {industry}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {portfolio.controls.previous}
        </span>
        {canNavigate && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="size-9"
              aria-label={portfolio.controls.previous}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="size-9"
              aria-label={portfolio.controls.next}
            >
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>

      <div
        className="relative mt-6 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex -mx-4" style={trackStyle} onTransitionEnd={handleTransitionEnd}>
          {projectsLoop.map((project, index) => {
            const normalizedIndex = totalProjects
              ? (index - baseOffset + totalProjects) % totalProjects
              : index;
            const accentIndex = totalProjects
              ? normalizedIndex % accentBadgeClasses.length
              : index % accentBadgeClasses.length;

            return (
              <article
                key={`${project.name}-${project.year}-${index}`}
                className="flex px-4"
                style={{ flex: `0 0 ${slideWidth}%` }}
              >
                <div className="group/card bg-card border border-border flex h-full grow flex-col rounded-3xl shadow-sm transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="relative overflow-hidden rounded-t-3xl h-48">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                      width={400}
                      height={192}
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
                      <Badge
                        variant="outline"
                        className="bg-card/80 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                      >
                        {project.industry}
                      </Badge>
                      <span className="rounded-full bg-card/80 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {project.year}
                      </span>
                    </div>
                  </div>
                  <div className="flex grow flex-col gap-4 p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`inline-flex size-11 items-center justify-center rounded-2xl ${accentBadgeClasses[accentIndex]}`}
                      >
                        <span className={`${accentIconClasses[accentIndex]} size-5`}></span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          <span>{project.year}</span>
                          <span className="ms-2 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                            {project.industry}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{project.tagline}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge variant="secondary" key={tech}>
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {project.highlights.map((highlight) => (
                        <li className="flex gap-2" key={highlight}>
                          <CheckIcon className="mt-0.5 size-4 text-primary" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-4">
                      <Link
                        href={`/${locale}/portfolio/${encodeURIComponent(project.name.toLowerCase().replace(/\s+/g, "-"))}`}
                        className="w-full"
                      >
                        <Button className="w-full group/btn rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all">
                          <span>{portfolio.projectPage.viewMore}</span>
                          <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {totalProjects > 1 && (
          <div className="mt-5 flex rounded-full p-2 justify-center gap-2">
            {projects.map((project, index) => {
              const isActive = index === activeDotIndex;
              return (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDotSelect(index)}
                  key={`${project.name}-${project.year}-dot-${index}`}
                  className="transition-all size-4 border-0"
                  aria-label={`${project.name} - ${index + 1}`}
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all ${
                      isActive ? "w-8 bg-orange-600" : "w-4 bg-muted"
                    }`}
                  ></span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
