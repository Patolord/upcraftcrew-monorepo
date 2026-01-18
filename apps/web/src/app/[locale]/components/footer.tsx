"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { sendConsultationEmail } from "@/app/actions/newsletter";
import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MailIcon } from "lucide-react";

export const Footer = () => {
  const { messages } = useLandingI18n();
  const { footer, common } = messages;
  const { form: formMessages, dialog: dialogMessages } = common;
  const currentYear = new Date().getFullYear().toString();
  const copyright = footer.legal.copyright.replace("{year}", currentYear);

  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!email || !email.includes("@")) {
      toast.error(formMessages.emailInvalid);
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await sendConsultationEmail(email);

      if (result.success) {
        setIsDialogOpen(false);
        setEmail("");
        toast.success(formMessages.emailSent, {
          duration: 4000,
          position: "bottom-right",
        });
      } else {
        toast.error(result.error || formMessages.emailError);
      }

      toast.error(formMessages.emailError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="group/section border-base-200 bg-neutral/1 scroll-mt-12 rounded-t-xl border-t pt-2 md:pt-12 lg:pt-8 2xl:pt-14"
      id={SECTION_IDS.contact}
    >
      <div className="container">
        <div className="flex items-center justify-center gap-1.5">
          <div className="bg-primary/80 h-2 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
          <p className="text-base-content/60 group-hover/section:text-primary font-mono text-sm font-medium transition-all">
            {footer.eyebrow}
          </p>
          <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
        </div>
        <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{footer.title}</p>
        <div className="mt-2 flex justify-center text-center">
          <p className="text-base-content/80 max-w-lg">{footer.description}</p>
        </div>
        <div className="mt-8 flex items-start justify-center gap-4">
          <div>
            <div className="input w-40 sm:w-64">
              <MailIcon className="text-base-content/80 size-5" />
              <input
                name="email"
                placeholder={common.form.emailPlaceholder}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <p className="text-base-content/60 mt-0.5 text-sm italic">{common.form.emailHelper}</p>
          </div>
          <Button className="btn btn-primary" onClick={handleSubmit}>
            {footer.cta}
          </Button>
        </div>
        <div className="mt-8 grid gap-6 md:mt-16 lg:grid-cols-2 xl:mt-24 2xl:mt-32">
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
              <p className="text-base-content/80 mt-4 max-w-sm leading-5">{footer.summary}</p>
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
                  <Link className="hover:link-primary" href="#" key={item}>
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
                      className="hover:link-primary flex items-center gap-2"
                      key={item}
                    >
                      {item}
                      <div className="badge badge-sm badge-primary rounded-full">
                        {footer.communityBadge}
                      </div>
                    </Link>
                  ) : (
                    <Link className="hover:link-primary" href="#" key={item}>
                      {item}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="text-base-200 mt-8" />
      <div className="container flex flex-wrap items-center justify-between gap-2 py-4">
        <p>{copyright}</p>
        <p>
          {footer.legal.credit.prefix}{" "}
          <Link
            href="https://x.com/upcraftcrew"
            className="text-blue-500 transition-all hover:text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            {footer.legal.credit.linkLabel}
          </Link>
        </p>
        <div className="inline-flex items-center gap-4">
          <Link href="#" className="hover:link-primary link link-hover">
            {footer.legal.terms}
          </Link>
          <Link href="#" className="hover:link-primary link link-hover">
            {footer.legal.privacy}
          </Link>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMessages.confirmEmail}</DialogTitle>
            <DialogDescription>{dialogMessages.confirmEmailDescription}</DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <p className="text-sm text-base-content/80">
              <strong>{dialogMessages.emailLabel}</strong> {email}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
              className="btn btn-outline"
            >
              {dialogMessages.editButton}
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading} className="btn btn-primary">
              {isLoading ? dialogMessages.sendingButton : dialogMessages.confirmButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
