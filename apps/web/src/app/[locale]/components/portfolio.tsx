"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";

import { SECTION_IDS } from "../constants";
import { useLandingI18n } from "../providers/landing-i18n-provider";
import { useQueryState, parseAsString } from "nuqs";
import Link from "next/link";

const AUTO_PLAY_INTERVAL = 2300;
const TRANSITION_MS = 320;
const accentBadgeClasses = [
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary",
  "bg-accent/10 text-accent",
];

const accentIconClasses = [
  "iconify lucide--sparkles",
  "iconify lucide--rocket",
  "iconify lucide--workflow",
];

export const Portfolio = () => {
  const { messages } = useLandingI18n();
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-center gap-1.5">
        <div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
        <p className="text-base-content/60 group-hover/section:text-primary font-mono text-sm font-medium transition-all">
          {portfolio.eyebrow}
        </p>
        <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
      </div>
      <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{portfolio.title}</p>

      {/* Industry Filter */}
      <div className="mt-8 flex justify-center">
        <div
          role="tablist"
          className="tabs bg-gray-200/50 tabs-boxed inline-flex flex-wrap gap-1.5 rounded-full p-1.5"
        >
          {industries.map((industry) => (
            <button
              key={industry}
              role="tab"
              aria-selected={selectedIndustry === industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`tab rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedIndustry === industry
                  ? "tab-active bg-primary text-primary-content shadow-sm"
                  : "hover:bg-base-300/50"
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.3em] text-base-content/60">
          {portfolio.controls.previous}
        </span>
        {canNavigate && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              className="btn btn-ghost btn-sm btn-square border border-base-200/60"
              aria-label={portfolio.controls.previous}
            >
              <span className="iconify lucide--arrow-left size-4"></span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-ghost btn-sm btn-square border border-base-200/60"
              aria-label={portfolio.controls.next}
            >
              <span className="iconify lucide--arrow-right size-4"></span>
            </button>
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
                <div className="group/card bg-base-100 border border-base-200/70 flex h-full grow flex-col rounded-3xl shadow-sm transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={project.image}
                      alt={project.alt}
                      className="h-56 w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
                      <span className="badge badge-outline bg-base-100/80 text-[0.65rem] uppercase tracking-[0.2em] text-base-content/70 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                        {project.industry}
                      </span>
                      <span className="rounded-full bg-base-100/80 px-2 py-0.5 text-xs font-medium text-base-content/70">
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
                        <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">
                          <span>{project.year}</span>
                          <span className="ms-2 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                            {project.industry}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="text-base-content/70 text-sm">{project.tagline}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span className="badge badge-ghost" key={tech}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className="text-base-content/70 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <ul className="space-y-2 text-sm text-base-content/70">
                      {project.highlights.map((highlight) => (
                        <li className="flex gap-2" key={highlight}>
                          <span className="iconify lucide--check mt-0.5 size-4 text-primary"></span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-4">
                      <Link
                        href={`/portfolio/${encodeURIComponent(project.name.toLowerCase().replace(/\s+/g, "-"))}`}
                        className="btn btn-primary btn-block group/btn"
                      >
                        <span>{portfolio.projectPage.viewMore}</span>
                        <span className="iconify lucide--arrow-right size-4 transition-transform group-hover/btn:translate-x-1"></span>
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
                <button
                  type="button"
                  onClick={() => handleDotSelect(index)}
                  key={`${project.name}-${project.year}-dot-${index}`}
                  className="transition-all"
                  aria-label={`${project.name} - ${index + 1}`}
                >
                  <span
                    className={`block h-1.5 rounded-full bg-orange-400 ${
                      isActive ? "w-8 bg-orange-600" : "w-4 bg-base-200"
                    }`}
                  ></span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
