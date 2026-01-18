import { Logo } from "./logo";
import type { PDFTemplateProps } from "./types";
import React from "react";

export function CoverPage({ budget }: PDFTemplateProps) {
  const currentDate = new Date().toLocaleDateString("pt-BR");

  return (
    <div
      className="w-[794px] h-[1123px] relative flex flex-col"
      style={{ backgroundColor: "#F0F0F0" }}
    >
      {/* Header with logo */}
      <div className="pt-16 px-16 flex justify-center">
        <Logo size="lg" />
      </div>

      {/* Divider */}
      <div className="px-16 mt-6">
        <div className="w-64 mx-auto h-[2px]" style={{ backgroundColor: "#969696" }} />
      </div>

      {/* Main title */}
      <div className="flex-1 flex flex-col items-center justify-center px-16 -mt-20">
        <h1 className="text-6xl font-bold lowercase tracking-tight" style={{ color: "#3C3C3C" }}>
          proposta
        </h1>
        <h1 className="text-6xl font-bold lowercase tracking-tight" style={{ color: "#3C3C3C" }}>
          comercial
        </h1>

        {/* Subtitle - project title */}
        <div className="mt-8 text-center">
          <p className="text-xl uppercase tracking-wide" style={{ color: "#3C3C3C" }}>
            {budget.title}
          </p>
        </div>
      </div>

      {/* Footer with date */}
      <div className="pb-12 px-16">
        <div className="w-full h-[1px] mb-6" style={{ backgroundColor: "#969696" }} />
        <div className="flex justify-end">
          <div className="px-6 py-2 border" style={{ borderColor: "#969696" }}>
            <span className="text-sm" style={{ color: "#3C3C3C" }}>
              {currentDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
