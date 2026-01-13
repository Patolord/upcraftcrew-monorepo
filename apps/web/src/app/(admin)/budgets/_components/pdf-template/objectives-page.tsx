import type { PDFTemplateProps } from "./types";

export function ObjectivesPage({ budget }: PDFTemplateProps) {
  const objectives = budget.objectives || [];

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

      {/* Section title */}
      <div className="px-16 mt-12 text-center">
        <h2 className="text-4xl font-bold" style={{ color: "#F2994A" }}>
          Objetivo do Projeto
        </h2>
        <div className="mt-2 mx-auto w-64 h-[2px]" style={{ backgroundColor: "#F2994A" }} />
        <p className="mt-6 text-sm text-white uppercase tracking-wide">
          ESTES SÃO OS PRINCIPAIS OBJETIVOS DESTA PROPOSTA
        </p>
      </div>

      {/* Objectives list */}
      <div className="flex-1 px-16 pt-12">
        <div className="space-y-8">
          {objectives.length > 0 ? (
            objectives.map((objective, index) => (
              <div key={index} className="flex gap-4">
                {/* Orange sidebar */}
                <div
                  className="w-2 flex-shrink-0 flex flex-col items-center py-4"
                  style={{ backgroundColor: "#F2994A" }}
                >
                  <span
                    className="text-xs font-bold text-white writing-vertical"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {objective.title || `OBJETIVO ${index + 1}`}
                  </span>
                </div>
                {/* Content */}
                <div className="flex-1 py-2">
                  <p className="text-sm text-white leading-relaxed uppercase">
                    {objective.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex gap-4">
              <div
                className="w-2 flex-shrink-0 flex flex-col items-center py-4"
                style={{ backgroundColor: "#F2994A" }}
              >
                <span
                  className="text-xs font-bold text-white"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  OBJETIVO 1
                </span>
              </div>
              <div className="flex-1 py-2">
                <p className="text-sm text-white leading-relaxed uppercase">{budget.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page number */}
      <div className="pb-8 px-12 flex justify-end">
        <span className="text-sm text-white">4</span>
      </div>
    </div>
  );
}
