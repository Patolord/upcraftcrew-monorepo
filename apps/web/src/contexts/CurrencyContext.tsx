"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Currency = "BRL" | "USD" | "EUR";

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  BRL: {
    code: "BRL",
    symbol: "R$",
    name: "Real Brasileiro",
    locale: "pt-BR",
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "Dólar Americano",
    locale: "en-US",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    locale: "de-DE",
  },
};

/**
 * Static exchange rates (USD as base = 1)
 *
 * WARNING: These are hardcoded exchange rates and do NOT reflect real-time market rates.
 * For production use, consider:
 * - Integrating with a currency exchange API (e.g., exchangerate-api.com, fixer.io)
 * - Updating rates periodically via a scheduled job
 * - Storing rates in a database with timestamps
 *
 * Current static rates (for demonstration only):
 */
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  BRL: 5.0, // 1 USD = 5 BRL (static example rate)
  EUR: 0.92, // 1 USD = 0.92 EUR (static example rate)
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  config: CurrencyConfig;
  formatAmount: (amount: number, options?: Intl.NumberFormatOptions) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  exchangeRates: Record<Currency, number>;
  CURRENCIES: Record<Currency, CurrencyConfig>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = "upcraft-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("BRL");

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem(STORAGE_KEY);
    if (
      savedCurrency &&
      (savedCurrency === "BRL" || savedCurrency === "USD" || savedCurrency === "EUR")
    ) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(STORAGE_KEY, newCurrency);
  };

  const config = CURRENCIES[currency];

  const formatAmount = (amount: number, options?: Intl.NumberFormatOptions) => {
    const defaultOptions: Intl.NumberFormatOptions = {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    // Se options tiver maximumFractionDigits, ajustar minimumFractionDigits também
    const mergedOptions: Intl.NumberFormatOptions = {
      ...defaultOptions,
      ...options,
    };

    // Garantir que minimumFractionDigits não seja maior que maximumFractionDigits
    if (
      mergedOptions.maximumFractionDigits !== undefined &&
      mergedOptions.minimumFractionDigits !== undefined &&
      mergedOptions.minimumFractionDigits > mergedOptions.maximumFractionDigits
    ) {
      mergedOptions.minimumFractionDigits = mergedOptions.maximumFractionDigits;
    }

    return new Intl.NumberFormat(config.locale, mergedOptions).format(amount);
  };

  const convertAmount = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return amount;

    // Convert to USD first (base currency)
    const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];

    // Convert from USD to target currency
    return amountInUSD * EXCHANGE_RATES[toCurrency];
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    config,
    formatAmount,
    convertAmount,
    exchangeRates: EXCHANGE_RATES,
    CURRENCIES,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
