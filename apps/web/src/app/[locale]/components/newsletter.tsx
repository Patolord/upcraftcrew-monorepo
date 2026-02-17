"use client";

import { useState } from "react";
import { toast } from "sonner";

import { sendConsultationEmail } from "@/app/actions/newsletter";
import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchIcon, SendIcon, UsersIcon, WrenchIcon } from "lucide-react";

export const Newsletter = () => {
  const { messages } = useLandingI18n();
  const { workflowAudit, common } = messages;
  const { form: auditForm } = workflowAudit;
  const { dialog: dialogMessages } = common;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    workflow: "",
    teamSize: "",
    currentTools: [] as string[],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToolToggle = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      currentTools: prev.currentTools.includes(tool)
        ? prev.currentTools.filter((t) => t !== tool)
        : [...prev.currentTools, tool],
    }));
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.email.includes("@")) {
      toast.error(common.form.emailInvalid);
      return;
    }
    if (!formData.name.trim()) {
      toast.error(common.form.nameInvalid);
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await sendConsultationEmail(formData);

      if (result.success) {
        setIsDialogOpen(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          workflow: "",
          teamSize: "",
          currentTools: [],
        });
        toast.success(common.form.emailSent, {
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
      className="group/section scroll-mt-12 pt-2 md:pt-12 lg:pt-8 2xl:pt-14"
      id={SECTION_IDS.contact}
    >
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-1.5">
          <div className="h-2 w-0.5 translate-x-1.5 rounded-full bg-orange-500/80 opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
          <p className="font-mono text-sm font-medium text-muted-foreground transition-all group-hover/section:text-orange-500">
            {workflowAudit.eyebrow}
          </p>
          <div className="h-4 w-0.5 -translate-x-1.5 rounded-full bg-orange-500/80 opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
        </div>
        <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{workflowAudit.title}</p>
        <div className="mt-2 flex justify-center text-center">
          <p className="max-w-xl text-muted-foreground">{workflowAudit.description}</p>
        </div>

        {/* Form */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-2xl border border-orange-500/20 bg-card p-6 shadow-lg shadow-orange-500/5 md:p-8">
            {/* Name + Email row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {auditForm.namePlaceholder}
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder={auditForm.namePlaceholder}
                  className="bg-background"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {auditForm.emailPlaceholder}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder={auditForm.emailPlaceholder}
                  className="bg-background"
                />
              </div>
            </div>

            {/* Company */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {auditForm.companyPlaceholder}
              </label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                placeholder={auditForm.companyPlaceholder}
                className="bg-background"
              />
            </div>

            {/* Workflow description */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                <SearchIcon className="mr-1.5 inline size-4 text-orange-500" />
                {auditForm.workflowLabel}
              </label>
              <Textarea
                value={formData.workflow}
                onChange={(e) => setFormData((p) => ({ ...p, workflow: e.target.value }))}
                placeholder={auditForm.workflowPlaceholder}
                rows={3}
                className="resize-none bg-background"
              />
            </div>

            {/* Team size */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                <UsersIcon className="mr-1.5 inline size-4 text-orange-500" />
                {auditForm.teamSizeLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {auditForm.teamSizeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, teamSize: option }))}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                      formData.teamSize === option
                        ? "border-orange-500 bg-orange-500/10 text-orange-600 font-medium"
                        : "border-border bg-background text-muted-foreground hover:border-orange-500/40"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Current tools */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                <WrenchIcon className="mr-1.5 inline size-4 text-orange-500" />
                {auditForm.currentToolsLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {auditForm.currentToolsOptions.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => handleToolToggle(tool)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                      formData.currentTools.includes(tool)
                        ? "border-orange-500 bg-orange-500/10 text-orange-600 font-medium"
                        : "border-border bg-background text-muted-foreground hover:border-orange-500/40"
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <Button
                onClick={handleSubmit}
                className="w-full gap-2 rounded-full bg-orange-500 py-3 text-white hover:bg-orange-600 h-12 text-base font-medium shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/30"
              >
                <SendIcon className="size-4" />
                {auditForm.submitButton}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground italic">
                {auditForm.privacyNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMessages.confirmEmail}</DialogTitle>
            <DialogDescription>{dialogMessages.confirmEmailDescription}</DialogDescription>
          </DialogHeader>
          <div className="my-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              <strong>{dialogMessages.nameLabel}</strong> {formData.name}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>{dialogMessages.emailLabel}</strong> {formData.email}
            </p>
            {formData.company && (
              <p className="text-sm text-muted-foreground">
                <strong>{dialogMessages.companyLabel}</strong> {formData.company}
              </p>
            )}
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
