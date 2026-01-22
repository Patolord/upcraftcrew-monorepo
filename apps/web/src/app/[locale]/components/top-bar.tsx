"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { SECTION_IDS, type SectionId } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { MoonIcon, SunIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";

export const Topbar = () => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { locale, messages, switchLocale } = useLandingI18n();
  const { theme, toggleTheme, mounted } = useTheme();
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

  const handleMenuItemClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <div
      className="group fixed start-0 end-0 top-0 z-10 flex justify-center md:top-4"
      data-at-top={scrollPosition < 30}
    >
      <div className="md:bg-background bg-background/90 flex h-16 items-center gap-20 px-4 backdrop-blur-sm transition-all duration-500 group-data-[at-top=false]:shadow group-data-[at-top=true]:bg-transparent hover:group-data-[at-top=false]:shadow-lg max-md:grow max-md:justify-between md:rounded-full md:px-8">
        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                <MenuIcon className="size-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0">
                <SheetHeader className="p-4">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <a href={`/${locale}`} onClick={handleMenuItemClick}>
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
                </SheetHeader>
                <div className="min-h-0 grow">
                  <SimpleBar className="size-full px-3">
                    <p className="mx-3 text-sm font-medium text-muted-foreground">
                      {mobileNavigationLabel}
                    </p>
                    <nav className="mt-1 flex flex-col gap-1">
                      {menuItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          onClick={handleMenuItemClick}
                          className="hover:bg-muted rounded-lg block px-3 py-2 text-sm transition-colors"
                        >
                          {item.title}
                        </a>
                      ))}
                    </nav>
                  </SimpleBar>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
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

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-1 md:flex">
          {menuItems.map((item, index) => (
            <a
              href={item.href}
              className="hover:bg-muted rounded-lg block px-3 py-1.5 text-sm transition-colors"
              key={index}
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <span id={`${languageToggleId}-label`} className="sr-only">
            {languageSwitch.ariaLabel}
          </span>
          <div className="flex items-center gap-2 rounded-full bg-background/90 px-2 py-1">
            <span
              className="text-xs font-medium uppercase text-muted-foreground"
              title={languageSwitch.options["pt-BR"]}
            >
              {localeAbbreviations.pt}
            </span>
            <Switch
              id={languageToggleId}
              size="sm"
              checked={locale === "en"}
              onCheckedChange={handleToggleLocale}
              aria-labelledby={`${languageToggleId}-label`}
            />
            <span
              className="text-xs font-medium uppercase text-muted-foreground"
              title={languageSwitch.options.en}
            >
              {localeAbbreviations.en}
            </span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="size-9 rounded-full"
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? (
              <SunIcon className="size-4" />
            ) : (
              <MoonIcon className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
