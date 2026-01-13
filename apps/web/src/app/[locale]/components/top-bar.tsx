"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { SECTION_IDS, type SectionId } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { ThemeProvider } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Topbar = () => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const { locale, messages, switchLocale } = useLandingI18n();
  const {
    topbar: { menu, mobileNavigationLabel, languageSwitch },
  } = messages;

  const menuItems = useMemo(
    () =>
      menu.map((item) => {
        const target = item.target as SectionId;
        const sectionId = SECTION_IDS[target] ?? item.target;
        return {
          ...item,
          href: `/${locale}#${sectionId}`,
        };
      }),
    [menu, locale],
  );

  const handleToggleLocale = useCallback(() => {
    const nextLocale = locale === "en" ? "pt" : "en";
    switchLocale(nextLocale);
  }, [locale, switchLocale]);

  const languageToggleId = useId();
  const localeAbbreviations = useMemo(
    () => ({
      pt: "PT",
      en: "EN",
    }),
    [],
  );

  const handleScroll = useCallback(() => {
    setScrollPosition(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      className="group fixed start-0 end-0 top-0 z-10 flex justify-center md:top-4"
      data-at-top={scrollPosition < 30}
    >
      <div className="md:bg-base-100 bg-base-100/90 flex h-16 items-center gap-20 px-4 backdrop-blur-xs transition-all duration-500 group-data-[at-top=false]:shadow group-data-[at-top=true]:bg-transparent hover:group-data-[at-top=false]:shadow-lg max-md:grow max-md:justify-between md:rounded-full md:px-8">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <div className="drawer">
              <input id="navigation-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                <label
                  htmlFor="navigation-drawer"
                  className="btn btn-sm btn-ghost btn-square drawer-button"
                >
                  <span className="iconify lucide--menu size-5"></span>
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="navigation-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <div className="bg-base-100 flex h-screen w-60 flex-col items-start px-3 py-4">
                  <div className="flex justify-start">
                    <a href={`/${locale}`}>
                      <Image
                        src="/logo/logo-dark.png"
                        alt="logo-dark"
                        width={120}
                        height={60}
                        className="hidden h-15 w-auto dark:block"
                      />
                      <Image
                        src="/logo/logo-light.png"
                        alt="logo-light"
                        width={120}
                        height={60}
                        className="block h-15 w-auto dark:hidden"
                      />
                    </a>
                  </div>
                  <div className="min-h-0 grow">
                    <SimpleBar className="mt-5 size-full">
                      <p className="text-base-content/60 mx-3 text-sm font-medium">
                        {mobileNavigationLabel}
                      </p>
                      <ul className="menu mt-1 w-full p-0">
                        {menuItems.map((item, index) => (
                          <li key={index}>
                            <a
                              key={index}
                              href={item.href}
                              className="hover:bg-base-200 rounded-box block px-3 py-1.5 text-sm"
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </SimpleBar>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href={`/${locale}`}>
            <Image
              src="/logo/logo-dark.png"
              alt="logo-dark"
              width={120}
              height={60}
              className="hidden h-15 w-auto dark:block"
            />
            <Image
              src="/logo/logo-light.png"
              alt="logo-light"
              width={120}
              height={60}
              className="block h-15 w-auto dark:hidden"
            />
          </a>
        </div>
        <div className="hidden items-center gap-1 md:flex">
          {menuItems.map((item, index) => (
            <a
              href={item.href}
              className="hover:bg-base-200 rounded-box block px-3 py-1.5 text-sm"
              key={index}
            >
              {item.title}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span id={`${languageToggleId}-label`} className="sr-only">
            {languageSwitch.ariaLabel}
          </span>
          <div className="flex items-center gap-2 rounded-full bg-base-100/90 px-2 py-1">
            <span
              className="text-xs font-medium uppercase text-base-content/70"
              title={languageSwitch.options["pt-BR"]}
            >
              {localeAbbreviations.pt}
            </span>
            <input
              className="toggle toggle-sm toggle-primary"
              id={languageToggleId}
              type="checkbox"
              role="switch"
              aria-labelledby={`${languageToggleId}-label`}
              checked={locale === "en"}
              onChange={handleToggleLocale}
            />
            <span
              className="text-xs font-medium uppercase text-base-content/70"
              title={languageSwitch.options.en}
            >
              {localeAbbreviations.en}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="btn-circle">
            <SunIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" className="btn-circle">
            <MoonIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
