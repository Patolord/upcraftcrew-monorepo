import type { PDFTemplateProps } from "./types";
import React from "react";

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function InvestmentPage({ budget }: PDFTemplateProps) {
  const paymentTerms = budget.paymentTerms || ["A VISTA"];

  return (
    <div
      className="w-[794px] h-[1123px] relative flex flex-col"
      style={{ backgroundColor: "#3C3C3C" }}
    >
      {/* Header with logo */}
      <div className="pt-8 px-12 flex justify-end">
        <div className="flex items-center gap-2">
          <svg
            width={40}
            height={40}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M32 8L52 24L32 40L12 24L32 8Z" fill="#F2994A" />
            <path d="M32 24L52 40L32 56L12 40L32 24Z" fill="#E07A2F" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm text-white">UPCRAFT</span>
            <span className="font-bold text-sm" style={{ color: "#F2994A" }}>
              CREW
            </span>
          </div>
        </div>
      </div>
      <div className="px-12 mt-2 flex justify-end">
        <div className="w-16 h-[1px]" style={{ backgroundColor: "#F2994A" }} />
      </div>

      {/* Page header */}
      <div className="px-12 mt-6">
        <div className="p-4" style={{ backgroundColor: "#4A5568" }}>
          <h2 className="text-xl font-bold text-white">Proposta Comercial -</h2>
          <p className="text-lg font-bold text-white">Cliente: {budget.client}</p>
          <p className="text-lg font-bold text-white">Proponente: Upcraft Crew – Soluções Web</p>
        </div>
      </div>

      {/* Investment section */}
      <div className="flex-1 px-12 pt-8">
        <h3 className="text-sm font-bold text-white uppercase mb-6">INVESTIMENTO</h3>

        {/* Investment table */}
        <div className="border" style={{ borderColor: "#969696" }}>
          {/* Header */}
          <div className="flex border-b" style={{ borderColor: "#969696" }}>
            <div className="flex-1 px-4 py-3">
              <span className="text-sm text-white">ITEM</span>
            </div>
            <div className="w-40 px-4 py-3 text-right">
              <span className="text-sm text-white">VALOR ({budget.currency})</span>
            </div>
          </div>

          {/* Items */}
          {budget.items.map((item, index) => (
            <div key={index} className="flex border-b" style={{ borderColor: "#969696" }}>
              <div className="flex-1 px-4 py-3">
                <span className="text-sm text-white">{item.description}</span>
              </div>
              <div className="w-40 px-4 py-3 text-right">
                <span className="text-sm text-white">
                  {formatCurrency(item.total, budget.currency)}
                </span>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="flex" style={{ backgroundColor: "#4A5568" }}>
            <div className="flex-1 px-4 py-3">
              <span className="text-sm font-bold text-white">TOTAL</span>
            </div>
            <div className="w-40 px-4 py-3 text-right">
              <span className="text-sm font-bold text-white">
                {formatCurrency(budget.totalAmount, budget.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment terms */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-white uppercase mb-4">FORMA DE PAGAMENTO</h3>
          <ul className="list-disc list-inside space-y-1">
            {paymentTerms.map((term, index) => (
              <li key={index} className="text-sm text-white">
                {term}
              </li>
            ))}
          </ul>
        </div>

        {/* Validity */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-white uppercase mb-2">Validade da Proposta</h3>
          <p className="text-sm text-white">
            Esta proposta é válida por 15 dias a partir da data de envio.
          </p>
        </div>

        {/* Notes */}
        {budget.notes && (
          <div className="mt-8">
            <h3 className="text-sm font-bold text-white uppercase mb-2">OBSERVAÇÕES</h3>
            <p className="text-sm text-white whitespace-pre-wrap">{budget.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pb-12 px-12 text-center">
        <p className="text-sm text-white">ATENCIOSAMENTE,</p>
        <p className="text-sm font-bold text-white mt-1">UPCRAFT CREW – SOLUÇÕES WEB</p>
      </div>

      {/* Page number */}
      <div className="absolute bottom-8 right-12">
        <span className="text-sm text-white">6</span>
      </div>
    </div>
  );
}
