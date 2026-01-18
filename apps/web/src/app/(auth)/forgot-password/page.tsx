"use client";

import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { sendResetPasswordEmail } from "@/app/actions/reset-password";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ data }: { data: ForgotPasswordFormData }) => {
    if (!isLoaded) return;

    setIsSubmitting(true);

    try {
      // Primeiro, iniciar o processo de reset no Clerk
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });

      // Depois, enviar o e-mail customizado via Resend
      const result = await sendResetPasswordEmail({ email: data.email });

      if (result.success) {
        toast.success("Reset code sent! Check your email.", {
          description: "We've sent you a verification code to reset your password.",
        });
        // Redirecionar para a página de reset com o email na query string
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
      } else {
        if (!result.userExists) {
          toast.error("User not found", {
            description: "No account exists with this email address.",
          });
        } else {
          toast.error("Failed to send email", {
            description: result.error || "Please try again later.",
          });
        }
      }
    } catch (err) {
      console.error("Error:", err);
      const error = err as { errors?: Array<{ message: string; code?: string }> };

      // Tratar erros específicos do Clerk
      if (error.errors?.[0]?.code === "form_identifier_not_found") {
        toast.error("User not found", {
          description: "No account exists with this email address.",
        });
      } else {
        toast.error("Failed to initiate password reset", {
          description: error.errors?.[0]?.message || "Please try again later.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
      <p className="text-gray-600 mb-8">
        Enter your email and we&apos;ll send you a code to reset your password
      </p>

      <Form control={control} onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-gray-700">
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="h-12 pl-4 pr-12 rounded-lg border-gray-200 bg-white"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#FF8E29] hover:bg-[#FF6B00] text-white font-medium rounded-full transition-colors"
        >
          {isSubmitting ? "Sending..." : "Send Reset Code"}
        </Button>

        <div className="text-center">
          <Link
            href="/sign-in"
            className="text-sm text-gray-600 hover:text-[#FF8E29] transition-colors"
          >
            Back to <span className="text-[#FF8E29]">Log in</span>
          </Link>
        </div>
      </Form>
    </div>
  );
}
