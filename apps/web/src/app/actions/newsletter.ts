"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const RESEND_TEST_EMAIL = "rodrigo@upcraftcrew.com";
const RESEND_SANDBOX_FROM = "onboarding@resend.dev";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export interface ConsultationFormPayload {
  name: string;
  email: string;
  company: string;
  workflow: string;
  teamSize: string;
  currentTools: string[];
}

/**
 * Test helper based on Resend's "Hello World" example.
 * Set RESEND_API_KEY in apps/web/.env.local as:
 * RESEND_API_KEY=re_xxxxxxxxx
 * and replace re_xxxxxxxxx with your real API key.
 */
export async function sendHelloWorldEmail() {
  try {
    const { data, error } = await sendWithVerifiedDomainFallback({
      from: RESEND_FROM,
      to: RESEND_TEST_EMAIL,
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendConsultationEmail(payload: ConsultationFormPayload) {
  try {
    const name = escapeHtml(payload.name.trim());
    const email = escapeHtml(payload.email.trim());
    const tools = escapeHtml(
      payload.currentTools.length > 0 ? payload.currentTools.join(", ") : "Not provided",
    );
    const company = escapeHtml(payload.company.trim() ? payload.company : "Not provided");
    const workflow = escapeHtml(payload.workflow.trim() ? payload.workflow : "Not provided");
    const teamSize = escapeHtml(payload.teamSize.trim() ? payload.teamSize : "Not provided");

    const { data, error } = await sendWithVerifiedDomainFallback({
      // In Resend sandbox mode, you can only send to your own account email.
      // After verifying a domain in Resend, set RESEND_FROM_EMAIL to your domain
      // and replace RESEND_TEST_EMAIL with your real recipient inbox.
      from: `Upcraft Crew <${RESEND_FROM}>`,
      to: [RESEND_TEST_EMAIL],
      replyTo: email,
      subject: "New Codebase Review Request",
      html: `
        <h2>New codebase review request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company / Project:</strong> ${company}</p>
        <p><strong>Team size:</strong> ${teamSize}</p>
        <p><strong>Current stack/tools:</strong> ${tools}</p>
        <p><strong>Biggest bottleneck:</strong></p>
        <p>${workflow}</p>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

type SendEmailArgs = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

async function sendWithVerifiedDomainFallback(args: SendEmailArgs) {
  const firstAttempt = await resend.emails.send(args);

  if (!firstAttempt.error) {
    return firstAttempt;
  }

  const errorMessage = firstAttempt.error.message?.toLowerCase() || "";
  const isUnverifiedDomainError =
    errorMessage.includes("domain") &&
    errorMessage.includes("not verified") &&
    !args.from.includes(RESEND_SANDBOX_FROM);

  if (!isUnverifiedDomainError) {
    return firstAttempt;
  }

  const senderNameMatch = args.from.match(/^(.*)<.*>$/);
  const senderName = senderNameMatch ? senderNameMatch[1].trim() : "";
  const fallbackFrom = senderName ? `${senderName} <${RESEND_SANDBOX_FROM}>` : RESEND_SANDBOX_FROM;

  return resend.emails.send({
    ...args,
    from: fallbackFrom,
  });
}
