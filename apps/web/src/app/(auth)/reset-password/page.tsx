"use client";

import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, KeyRound } from "lucide-react";

interface ResetPasswordFormData {
  code: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!isLoaded) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Password reset successfully");
        router.push("/reset-password-done");
      }
    } catch (err) {
      console.error("Error:", err);
      const error = err as { errors?: Array<{ message: string }> };
      toast.error(error.errors?.[0]?.message || "Failed to reset password");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
      <p className="text-gray-600 mb-8">Enter the code sent to your email and your new password</p>

      <Form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm text-gray-700">
            Verification Code
          </Label>
          <div className="relative">
            <Input
              id="code"
              type="text"
              placeholder="Enter code from email"
              className="h-12 pl-4 pr-12 rounded-lg border-gray-200 bg-white"
              {...register("code", {
                required: "Verification code is required",
                minLength: {
                  value: 6,
                  message: "Code must be at least 6 characters",
                },
              })}
            />
            <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-gray-700">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="h-12 pl-4 pr-12 rounded-lg border-gray-200 bg-white"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm text-gray-700">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="h-12 pl-4 pr-12 rounded-lg border-gray-200 bg-white"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            <Button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#FF8E29] hover:bg-[#FF6B00] text-white font-medium rounded-full transition-colors"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
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
