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
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/email/gmail/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errData = await tokenRes.text();
      console.error("Gmail token exchange failed:", errData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/assistant?error=token_exchange_failed`,
      );
    }

    const tokenData = await tokenRes.json();

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
    );
    const profile = await profileRes.json();

    const convexToken = await getToken({ template: "convex" });
    if (!convexToken) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/assistant?error=convex_token_failed`,
      );
    }

    convex.setAuth(convexToken);
    await convex.mutation(api.emailAccounts.storeAccount, {
      provider: "gmail",
      email: profile.email,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiry: Date.now() + tokenData.expires_in * 1000,
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/assistant?connected=gmail&email=${encodeURIComponent(profile.email)}`,
    );
  } catch (err) {
    console.error("Gmail OAuth callback error:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/assistant?error=callback_failed`,
    );
  }
}
