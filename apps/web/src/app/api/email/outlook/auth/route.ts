import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error: "Microsoft OAuth not configured",
        hint: "Add MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET to apps/web/.env.local",
      },
      { status: 500 },
    );
  }

  const redirectUri = appUrl ? `${appUrl}/api/email/outlook/callback` : undefined;
  if (!redirectUri) {
    return NextResponse.json(
      {
        error: "NEXT_PUBLIC_APP_URL not set",
        hint: "Add NEXT_PUBLIC_APP_URL (e.g. http://localhost:3001) to apps/web/.env.local",
      },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope:
      "https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Calendars.Read offline_access User.Read",
    response_mode: "query",
    state: userId,
  });

  return NextResponse.redirect(
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`,
  );
}
