"use client";

import Image from "next/image";
import Link from "next/link";

import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const { messages } = useLandingI18n();
  const { footer } = messages;
  const currentYear = new Date().getFullYear().toString();
  const copyright = footer.legal.copyright.replace("{year}", currentYear);

  return (
    <footer className="mt-8 md:mt-16">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="col-span-1">
            <div>
              <Link href="/">
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
              </Link>
              <p className="mt-4 max-w-sm leading-5 text-muted-foreground">{footer.summary}</p>
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.upcraftcrew.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/brand-logo/google.svg"
                    className="size-5 dark:invert"
                    alt="Google Play"
                  />
                </Link>
                <Link
                  href="https://github.com/upcraftcrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <img
                    src="/images/brand-logo/github.svg"
                    className="size-6 dark:invert"
                    alt="GitHub"
                  />
                </Link>
                <Link
                  href="https://x.com/upcraftcrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <img src="/images/brand-logo/x.svg" className="size-5 dark:invert" alt="X" />
                </Link>
                <Link
                  href="https://instagram.com/upcraftcrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <span className="iconify ri--instagram-fill size-6" />
                </Link>
                <Link
                  href="https://api.whatsapp.com/send/?phone=11914246379&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <span className="iconify ri--whatsapp-fill size-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-medium">{footer.quickLinks.title}</h2>
              <div className="mt-2 flex flex-col gap-2">
                {footer.quickLinks.items.map((item) => (
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    href="#"
                    key={item}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium">{footer.resources.title}</h2>
              <div className="mt-2 flex flex-col gap-2">
                {footer.resources.items.map((item, index) => {
                  const isCommunity = index === 3;
                  return isCommunity ? (
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                      key={item}
                    >
                      {item}
                      <Badge variant="default" className="rounded-full">
                        {footer.communityBadge}
                      </Badge>
                    </Link>
                  ) : (
                    <Link
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      href="#"
                      key={item}
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="mt-8" />
      <div className="container flex flex-wrap items-center justify-between gap-2 py-4">
        <p className="text-sm text-muted-foreground">{copyright}</p>
        <p className="text-sm text-muted-foreground">
          {footer.legal.credit.prefix}{" "}
          <Link
            href="https://x.com/upcraftcrew"
            className="text-blue-500 transition-colors hover:text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            {footer.legal.credit.linkLabel}
          </Link>
        </p>
        <div className="inline-flex items-center gap-4">
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
          >
            {footer.legal.terms}
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
          >
            {footer.legal.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
};
