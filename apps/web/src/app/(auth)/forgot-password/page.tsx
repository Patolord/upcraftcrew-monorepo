"use client";

import { Form, useForm } from "react-hook-form";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail } from "lucide-react";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (!isLoaded) return;

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });

      toast.success("Reset code sent to your email");
      router.push("/reset-password");
    } catch (err) {
      console.error("Error:", err);
      const error = err as { errors?: Array<{ message: string }> };
      toast.error(error.errors?.[0]?.message || "Failed to send reset email");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
      <p className="text-gray-600 mb-8">
        Enter your email and we'll send you a code to reset your password
      </p>

      <Form className="space-y-6">
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
