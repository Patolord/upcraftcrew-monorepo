import enMessages from "@/app/[locale]/messages/en.json";
import ptMessages from "@/app/[locale]/messages/pt.json";
import type {
  LandingLocale,
  LandingMessages,
} from "@/app/[locale]/providers/landing-i18n-provider";

const messagesMap = {
  en: enMessages,
  pt: ptMessages,
} as const;

export async function getLandingMessages(locale: string): Promise<LandingMessages> {
  const messages = messagesMap[locale as LandingLocale] || messagesMap.en;
  return messages;
}
