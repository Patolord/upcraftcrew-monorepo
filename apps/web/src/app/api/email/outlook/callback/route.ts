import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/assistant?error=not_authenticated`,
    );
  }

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/assistant?error=oauth_denied`,
    );
  }

  try {
    const tokenRes = await fetch(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.MICROSOFT_CLIENT_ID!,
          client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/email/outlook/callback`,
          grant_type: "authorization_code",
          scope:
            "https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Calendars.Read offline_access User.Read",
        }),
      },
    );

    if (!tokenRes.ok) {
      const errData = await tokenRes.text();
      console.error("Outlook token exchange failed:", errData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/assistant?error=token_exchange_failed`,
      );
    }

    const tokenData = await tokenRes.json();

    const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    const email =
      profile.mail || profile.userPrincipalName || profile.id;

    const convexToken = await getToken({ template: "convex" });
    if (!convexToken) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/assistant?error=convex_token_failed`,
      );
    }

    convex.setAuth(convexToken);
    await convex.mutation(api.emailAccounts.storeAccount, {
      provider: "outlook",
      email,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiry: Date.now() + tokenData.expires_in * 1000,
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/assistant?connected=outlook&email=${encodeURIComponent(email)}`,
    );
  } catch (err) {
    console.error("Outlook OAuth callback error:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/assistant?error=callback_failed`,
    );
  }
}
