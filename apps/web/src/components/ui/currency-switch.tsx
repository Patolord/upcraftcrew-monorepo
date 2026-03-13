"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type CurrencyCode = "BRL" | "USD";

interface CurrencySwitchProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
  className?: string;
}

const currencies: { code: CurrencyCode; flag: string; label: string }[] = [
  { code: "BRL", flag: "🇧🇷", label: "Real" },
  { code: "USD", flag: "🇺🇸", label: "Dólar" },
];

export function CurrencySwitch({ value, onChange, className }: CurrencySwitchProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-white dark:bg-muted/50 shadow-sm p-0.5 gap-0.5",
        className,
      )}
    >
      {currencies.map((c) => (
        <button
          key={c.code}
          type="button"
          onClick={() => onChange(c.code)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            value === c.code
              ? "bg-orange-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
          title={c.label}
        >
          <span className="text-sm leading-none">{c.flag}</span>
          <span className="hidden sm:inline">{c.code}</span>
        </button>
      ))}
    </div>
  );
}
