import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";

/**
 * Verifica se o usuário atual tem acesso pago ao conteúdo de vídeo.
 *
 * @param redirectTo - URL para redirecionar se não tiver acesso (default: /purchase)
 * @returns true se tem acesso, ou redireciona automaticamente
 *
 * @example
 * // Em um Server Component:
 * export default async function ProtectedPage() {
 *   await requireVideoAccess();
 *   // ... resto do código só executa se tiver acesso
 * }
 */
export async function requireAccess(redirectTo = "/purchase"): Promise<true> {
  const { userId: clerkUserId, getToken } = await auth();

  // Se não está logado, redireciona para compra
  if (!clerkUserId) {
    redirect(redirectTo);
  }

  // Obtém token do Convex para autenticação
  const token = await getToken({ template: "convex" }).catch(() => null);

  // Verifica acesso no Convex (fonte de verdade)
  const hasAccess = await fetchQuery(api.userAccess.checkUserHasAccess, {}, token ? { token } : {});

  if (!hasAccess) {
    redirect(redirectTo);
  }

  return true;
}

/**
 * Verifica acesso sem redirecionar automaticamente.
 * Útil quando você precisa fazer lógica condicional.
 *
 * @returns { hasAccess: boolean, clerkUserId: string | null }
 *
 * @example
 * const { hasAccess, userId } = await checkVideoAccess();
 * if (!hasAccess) {
 *   // mostrar conteúdo limitado
 * }
 */
export async function checkAccess(): Promise<{
  hasAccess: boolean;
  clerkUserId: string | null;
}> {
  const { userId: clerkUserId, getToken } = await auth();

  if (!clerkUserId) {
    return { hasAccess: false, clerkUserId: null };
  }

  const token = await getToken({ template: "convex" }).catch(() => null);

  const hasAccess = await fetchQuery(api.userAccess.checkUserHasAccess, {}, token ? { token } : {});

  return { hasAccess, clerkUserId };
}
