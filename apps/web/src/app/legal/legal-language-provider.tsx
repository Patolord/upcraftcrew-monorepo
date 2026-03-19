"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Lang = "en" | "pt";

const LegalLanguageContext = createContext<{
  lang: Lang;
  toggle: () => void;
}>({ lang: "en", toggle: () => {} });

export function useLegalLanguage() {
  return useContext(LegalLanguageContext);
}

export function LegalLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const toggle = useCallback(() => setLang((l) => (l === "en" ? "pt" : "en")), []);

  return (
    <LegalLanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LegalLanguageContext.Provider>
  );
}

export function LanguageToggle() {
  const { lang, toggle } = useLegalLanguage();

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
    >
      <span className="text-base leading-none">{lang === "en" ? "🇧🇷" : "🇺🇸"}</span>
      {lang === "en" ? "Traduzir para Português" : "Translate to English"}
    </button>
  );
}
