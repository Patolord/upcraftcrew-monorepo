import React from "react";

const companyDescription = [
  "A UPCRAFT CREW É UMA AGÊNCIA DE DESENVOLVIMENTO DE SOFTWARE QUE ENTREGA SOLUÇÕES DIGITAIS PERSONALIZADAS, COMBINANDO DESIGN, TECNOLOGIA E ESTRATÉGIA.",
  "NOSSA EQUIPE É FORMADA POR PROFISSIONAIS EXPERIENTES E COMPROMETIDOS COM A QUALIDADE, OFERECENDO PROJETOS SOB MEDIDA QUE UNEM ESTÉTICA, FUNCIONALIDADE E DESEMPENHO.",
  "DESENVOLVEMOS DESDE SITES INSTITUCIONAIS E LANDING PAGES ATÉ APLICAÇÕES WEB COMPLEXAS, SEMPRE COM FOCO EM GERAR VALOR REAL PARA O CLIENTE E MAXIMIZAR O RETORNO SOBRE O INVESTIMENTO.",
];

export function AboutPage() {
  return (
    <div
      className="w-[794px] h-[1123px] relative flex flex-col"
      style={{ backgroundColor: "#F0F0F0" }}
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
            <span className="font-bold text-sm" style={{ color: "#3C3C3C" }}>
              UPCRAFT
            </span>
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
      <div className="px-16 mt-12">
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-1" style={{ backgroundColor: "#969696" }} />
          <div className="flex items-center gap-3">
            <svg
              width={48}
              height={48}
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M32 8L52 24L32 40L12 24L32 8Z" fill="#F2994A" />
              <path d="M32 24L52 40L32 56L12 40L32 24Z" fill="#E07A2F" />
            </svg>
            <h2 className="text-4xl font-bold" style={{ color: "#3C3C3C" }}>
              Quem somos
            </h2>
          </div>
          <div className="h-[1px] flex-1" style={{ backgroundColor: "#969696" }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-24 pt-16">
        <div className="space-y-8">
          {companyDescription.map((paragraph, index) => (
            <p
              key={index}
              className="text-sm leading-relaxed font-medium uppercase"
              style={{ color: "#3C3C3C" }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Page number */}
      <div className="pb-8 px-12 flex justify-end">
        <span className="text-sm" style={{ color: "#3C3C3C" }}>
          3
        </span>
      </div>
    </div>
  );
}
