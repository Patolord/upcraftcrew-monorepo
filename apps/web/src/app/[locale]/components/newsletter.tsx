"use client";

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
import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";

export const Newsletter = () => {
  const { messages } = useLandingI18n();
  const { footer, common } = messages;
  const { form: formMessages, dialog: dialogMessages } = common;

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
    <section
      className="group/section scroll-mt-12 rounded-t-xl border-t pt-2 md:pt-12 lg:pt-8 2xl:pt-14"
      id={SECTION_IDS.contact}
    >
      <div className="container">
        <div className="flex items-center justify-center gap-1.5">
          <div className="h-2 w-0.5 translate-x-1.5 rounded-full bg-primary/80 opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
          <p className="font-mono text-sm font-medium text-muted-foreground transition-all group-hover/section:text-primary">
            {footer.eyebrow}
          </p>
          <div className="h-4 w-0.5 -translate-x-1.5 rounded-full bg-primary/80 opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
        </div>
        <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{footer.title}</p>
        <div className="mt-2 flex justify-center text-center">
          <p className="max-w-lg text-muted-foreground">{footer.description}</p>
        </div>
        <div className="mt-8 flex items-start justify-center gap-4">
          <div>
            <div className="relative w-40 sm:w-64">
              <MailIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="email"
                placeholder={common.form.emailPlaceholder}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="pl-10"
              />
            </div>
            <p className="mt-0.5 text-sm italic text-muted-foreground">{common.form.emailHelper}</p>
          </div>
          <Button onClick={handleSubmit}>{footer.cta}</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMessages.confirmEmail}</DialogTitle>
            <DialogDescription>{dialogMessages.confirmEmailDescription}</DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <p className="text-sm text-muted-foreground">
              <strong>{dialogMessages.emailLabel}</strong> {email}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              {dialogMessages.editButton}
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? dialogMessages.sendingButton : dialogMessages.confirmButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
