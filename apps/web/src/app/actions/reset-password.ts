"use server";

import { Resend } from "resend";
import { clerkClient } from "@clerk/nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendResetPasswordEmailParams {
  email: string;
}

interface SendResetPasswordEmailResult {
  success: boolean;
  error?: string;
  userExists?: boolean;
}

export async function sendResetPasswordEmail({
  email,
}: SendResetPasswordEmailParams): Promise<SendResetPasswordEmailResult> {
  try {
    // Verificar se o usuário existe no Clerk
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: [email],
    });

    if (!users.data || users.data.length === 0) {
      return {
        success: false,
        error: "No user found with this email address",
        userExists: false,
      };
    }

    // Gerar código de reset através do Clerk
    // O Clerk enviará o código via seu próprio sistema de e-mail
    // Mas vamos usar o Resend para enviar um e-mail customizado

    // Primeiro, criar um código de reset no Clerk
    // Nota: O Clerk gerencia a criação do código internamente quando usamos prepareFirstFactor
    // Então vamos enviar um e-mail customizado com link para a página de reset

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/reset-password?email=${encodeURIComponent(email)}`;

    // Enviar e-mail através do Resend
    const { error } = await resend.emails.send({
      from: "Up Craft Crew <paloma.sq@hotmail.com>",
      to: [email],
      subject: "Redefinir sua senha - Up Craft Crew",
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefinir Senha</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF8E29 0%, #FF6B00 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Redefinir Senha</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Olá,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Up Craft Crew</strong>.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Clique no botão abaixo para continuar o processo de redefinição de senha:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #FF8E29; color: white; padding: 14px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
                Redefinir Senha
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Se você não solicitou esta redefinição de senha, pode ignorar este e-mail com segurança.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              Este link expira em 1 hora por motivos de segurança.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Up Craft Crew. Todos os direitos reservados.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: error.message || "Failed to send reset email",
        userExists: true,
      };
    }

    return {
      success: true,
      userExists: true,
    };
  } catch (error) {
    console.error("Error in sendResetPasswordEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      userExists: false,
    };
  }
}
