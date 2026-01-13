"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConsultationEmail(email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["paloma.sq@hotmail.com"],
      subject: "Nova solicitação de consultoria gratuita",
      html: `
        <h2>Nova pessoa interessada em consultoria gratuita!</h2>
        <p><strong>E-mail:</strong> ${email}</p>
        <p>Esta pessoa se inscreveu através do formulário no footer da landing page.</p>
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
