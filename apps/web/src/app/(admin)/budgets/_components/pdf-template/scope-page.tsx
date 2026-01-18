import type { PDFTemplateProps } from "./types";
import React from "react";

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function ScopePage({ budget }: PDFTemplateProps) {
  const scopeOptions = budget.scopeOptions || [];
  const extras = budget.extras || [];

  return (
    <div
      className="w-[794px] h-[1123px] relative flex flex-col"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Header with logo */}
      <div className="pt-8 px-12 flex justify-end">
        <div className="flex items-center gap-2">
          <svg
            width={32}
            height={32}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M32 8L52 24L32 40L12 24L32 8Z" fill="#F2994A" />
            <path d="M32 24L52 40L32 56L12 40L32 24Z" fill="#E07A2F" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-xs" style={{ color: "#3C3C3C" }}>
              UPCRAFT
            </span>
            <span className="font-bold text-xs" style={{ color: "#F2994A" }}>
              CREW
            </span>
          </div>
        </div>
      </div>

      {/* Page header */}
      <div className="px-12 mt-6">
        <h2 className="text-2xl font-bold" style={{ color: "#3C3C3C" }}>
          Proposta Comercial - {budget.title}
        </h2>
        <p className="text-lg font-bold" style={{ color: "#3C3C3C" }}>
          Cliente: {budget.client}
        </p>
        <p className="text-lg font-bold" style={{ color: "#3C3C3C" }}>
          Proponente: Upcraft Crew – Soluções Web
        </p>
        <div className="mt-2 h-[2px]" style={{ backgroundColor: "#F2994A" }} />
      </div>

      {/* Scope section */}
      <div className="flex-1 px-12 pt-6 overflow-hidden">
        <h3 className="text-sm font-bold uppercase mb-4" style={{ color: "#3C3C3C" }}>
          ESCOPO DO PROJETO
        </h3>

        {/* Scope options */}
        <div className="space-y-6">
          {scopeOptions.length > 0 ? (
            scopeOptions.map((option, index) => (
              <div key={index}>
                <h4 className="text-sm font-bold uppercase mb-2" style={{ color: "#3C3C3C" }}>
                  {option.name}
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-xs" style={{ color: "#3C3C3C" }}>
                      {feature}
                    </li>
                  ))}
                </ul>
                {option.value && (
                  <p className="mt-2 text-sm" style={{ color: "#3C3C3C" }}>
                    VALOR: {formatCurrency(option.value, budget.currency)}
                  </p>
                )}
                <div className="mt-3 h-[1px]" style={{ backgroundColor: "#969696" }} />
              </div>
            ))
          ) : (
            <p className="text-sm" style={{ color: "#3C3C3C" }}>
              {budget.description}
            </p>
          )}
        </div>

        {/* Extras section */}
        {extras.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase mb-4" style={{ color: "#3C3C3C" }}>
              EXTRAS OPCIONAIS (SOB CONTRATAÇÃO ADICIONAL)
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              {extras.map((extra, index) => (
                <li key={index} className="text-xs" style={{ color: "#3C3C3C" }}>
                  {extra.description}
                  {extra.recurrence &&
                    ` - ${formatCurrency(extra.value, budget.currency)}/${extra.recurrence}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delivery deadline */}
        {budget.deliveryDeadline && (
          <div className="mt-6">
            <p className="text-xs" style={{ color: "#3C3C3C" }}>
              PRAZO DE ENTREGA DESENVOLVIMENTO: {budget.deliveryDeadline}
            </p>
          </div>
        )}
      </div>

      {/* Page number */}
      <div className="pb-8 px-12 flex justify-end">
        <span className="text-sm" style={{ color: "#3C3C3C" }}>
          5
        </span>
      </div>
    </div>
  );
}
