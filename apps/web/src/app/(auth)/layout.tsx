"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getRightSideContent = () => {
    switch (pathname) {
      case "/sign-in":
        return {
          title: (
            <>
              Hey,
              <br />
              Welcome
              <br />
              Back!
            </>
          ),
        };
      case "/sign-up":
        return {
          title: (
            <>
              Hey,
              <br />
              Register
              <br />
              Yourself
            </>
          ),
        };
      case "/forgot-password":
        return {
          title: (
            <>
              Hey,
              <br />
              Forgot
              <br />
              Password?
            </>
          ),
        };
      case "/reset-password":
        return {
          title: (
            <>
              Hey,
              <br />
              Reset
              <br />
              Password
            </>
          ),
        };
      case "/reset-password-done":
        return {
          title: (
            <>
              Your
              <br />
              Password
              <br />
              Updated
            </>
          ),
        };
      default:
        return {
          title: (
            <>
              Hey,
              <br />
              Welcome
              <br />
              Back!
            </>
          ),
        };
    }
  };

  const content = getRightSideContent();

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center bg-[#FFF9F4] p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Image src="/logo/logo-light-mini.png" alt="logo" width={100} height={100} />
            </div>
            <div className="text-xl font-semibold text-foreground">Up Craft Crew</div>
          </div>

          {/* Form content */}
          {children}
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-[#FF8E29] to-[#FF6B00] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 text-white">
          <h1 className="text-5xl font-bold leading-tight">{content.title}</h1>
        </div>
      </div>
    </div>
  );
}
