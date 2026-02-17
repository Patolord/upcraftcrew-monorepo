"use client";

import { useState } from "react";
import { toast } from "sonner";

import { sendConsultationEmail } from "@/app/actions/newsletter";
import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircleIcon, DownloadIcon, FileTextIcon, MailIcon } from "lucide-react";

export const LeadMagnet = () => {
  const { messages } = useLandingI18n();
  const { leadMagnet, common } = messages;

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      toast.error(common.form.emailInvalid);
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendConsultationEmail({
        name: "Lead Magnet Request",
        email,
        company: "",
        workflow: "Requested codebase checklist from lead magnet form.",
        teamSize: "",
        currentTools: [],
      });
      if (result.success) {
        setIsSubmitted(true);
        toast.success("Checklist sent to your inbox!", {
          duration: 4000,
          position: "bottom-right",
        });
      } else {
        toast.error(result.error || common.form.emailError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="container scroll-mt-12 py-8 md:py-12 lg:py-16 2xl:py-20"
      id={SECTION_IDS.leadMagnet}
    >
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-background to-orange-600/5">
        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 size-60 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-orange-400/5 blur-3xl" />

        <div className="relative grid gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-12">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-600">
              <FileTextIcon className="size-3" />
              {leadMagnet.eyebrow}
            </div>

            <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
              {leadMagnet.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{leadMagnet.description}</p>

            {/* Checklist items */}
            <ul className="mt-6 space-y-2.5">
              {leadMagnet.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-orange-500" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div className="flex items-center">
            <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-lg shadow-orange-500/5">
              {isSubmitted ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="rounded-full bg-green-500/10 p-4">
                    <CheckCircleIcon className="size-8 text-green-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{leadMagnet.successTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {leadMagnet.successDescription}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-500/10 p-3">
                      <DownloadIcon className="size-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold">{leadMagnet.cardTitle}</p>
                      <p className="text-xs text-muted-foreground">{leadMagnet.cardSubtitle}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder={leadMagnet.emailPlaceholder}
                        className="bg-background pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="mt-3 w-full gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 h-11 font-medium shadow-lg shadow-orange-500/20"
                  >
                    <DownloadIcon className="size-4" />
                    {isLoading ? leadMagnet.sending : leadMagnet.cta}
                  </Button>

                  <p className="mt-2 text-center text-xs italic text-muted-foreground">
                    {leadMagnet.ctaHelper}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
