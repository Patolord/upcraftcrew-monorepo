import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: "text-sm" },
  md: { icon: 48, text: "text-base" },
  lg: { icon: 64, text: "text-xl" },
};

export function Logo({ size = "md", variant = "full", className = "" }: LogoProps) {
  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Chevron icon */}
      <svg width={icon} height={icon} viewBox="0 0 64 64" fill="none" xmlns="/logo/logo-light.png">
        {/* Top chevron - lighter orange */}
        <path d="M32 8L52 24L32 40L12 24L32 8Z" fill="#F2994A" />
        {/* Bottom chevron - darker orange */}
        <path d="M32 24L52 40L32 56L12 40L32 24Z" fill="#E07A2F" />
      </svg>

      {variant === "full" && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold tracking-wide ${text}`} style={{ color: "#3C3C3C" }}>
            UPCRAFT
          </span>
          <span className={`font-bold tracking-wide ${text}`} style={{ color: "#F2994A" }}>
            CREW
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoSmall({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={24} height={24} viewBox="0 0 64 64" fill="none" xmlns="/logo/logo-light-mini.png">
        <path d="M32 8L52 24L32 40L12 24L32 8Z" fill="#F2994A" />
        <path d="M32 24L52 40L32 56L12 40L32 24Z" fill="#E07A2F" />
      </svg>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-xs" style={{ color: "#3C3C3C" }}>
          UPCRAFT
        </span>
        <span className="font-bold text-xs" style={{ color: "#F2994A" }}>
          CREW
        </span>
      </div>
    </div>
  );
}
