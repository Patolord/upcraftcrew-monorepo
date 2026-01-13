import { redirect } from "next/navigation";
import type { Route } from "next";

// Redirect to English as the default language
export default function RootPage() {
  redirect("/en" as Route);
}
