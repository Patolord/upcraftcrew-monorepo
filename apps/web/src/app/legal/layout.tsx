import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LegalLanguageProvider } from "./legal-language-provider";

export const metadata: Metadata = {
  title: "Legal | Up Craft Crew",
  description: "Legal documents for the Up Craft Crew application",
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <LegalLanguageProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex h-16 items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/logo-dark.png"
                alt="Up Craft Crew"
                width={100}
                height={50}
                className="hidden h-10 w-auto dark:block"
              />
              <Image
                src="/logo/logo-light.png"
                alt="Up Craft Crew"
                width={100}
                height={50}
                className="block h-10 w-auto dark:hidden"
              />
            </Link>
          </div>
        </header>
        <main className="container max-w-3xl py-12 md:py-16">{children}</main>
        <footer className="border-t">
          <div className="container flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Up Craft Crew. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/legal/terms" className="hover:text-primary hover:underline">
                Terms of Service
              </Link>
              <Link href="/legal/privacy" className="hover:text-primary hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </LegalLanguageProvider>
  );
}
