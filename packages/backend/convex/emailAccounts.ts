import { v } from "convex/values";
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { throwNotFound, throwUnauthorized } from "./errors";
import { internal } from "./_generated/api";

// ============================================================================
// QUERIES
// ============================================================================

export const getMyAccounts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return ctx.db
      .query("emailAccounts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const getMyFavorites = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return ctx.db
      .query("emailFavorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

export const storeAccount = mutation({
  args: {
    provider: v.union(v.literal("gmail"), v.literal("outlook")),
    email: v.string(),
    accessToken: v.string(),
    refreshToken: v.string(),
    tokenExpiry: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existing = await ctx.db
      .query("emailAccounts")
      .withIndex("by_user_email", (q) =>
        q.eq("userId", user._id).eq("email", args.email),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        tokenExpiry: args.tokenExpiry,
        isActive: true,
      });
      return existing._id;
    }

    return ctx.db.insert("emailAccounts", {
      userId: user._id,
      provider: args.provider,
      email: args.email,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      tokenExpiry: args.tokenExpiry,
      isActive: true,
      connectedAt: Date.now(),
    });
  },
});

export const updateTokens = mutation({
  args: {
    accountId: v.id("emailAccounts"),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    tokenExpiry: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const account = await ctx.db.get(args.accountId);
    if (!account) throwNotFound("Email account");
    if (account.userId !== user._id) throwUnauthorized();

    await ctx.db.patch(args.accountId, {
      accessToken: args.accessToken,
      ...(args.refreshToken && { refreshToken: args.refreshToken }),
      tokenExpiry: args.tokenExpiry,
    });
  },
});

export const removeAccount = mutation({
  args: { accountId: v.id("emailAccounts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const account = await ctx.db.get(args.accountId);
    if (!account) throwNotFound("Email account");
    if (account.userId !== user._id) throwUnauthorized();

    await ctx.db.delete(args.accountId);
  },
});

export const toggleFavoriteAddress = mutation({
  args: {
    emailAddress: v.string(),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existing = await ctx.db
      .query("emailFavorites")
      .withIndex("by_user_address", (q) =>
        q.eq("userId", user._id).eq("emailAddress", args.emailAddress),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { favorited: false };
    }

    await ctx.db.insert("emailFavorites", {
      userId: user._id,
      emailAddress: args.emailAddress,
      displayName: args.displayName,
      favoritedAt: Date.now(),
    });
    return { favorited: true };
  },
});

export const internalUpdateTokens = internalMutation({
  args: {
    accountId: v.id("emailAccounts"),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    tokenExpiry: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.accountId, {
      accessToken: args.accessToken,
      ...(args.refreshToken && { refreshToken: args.refreshToken }),
      tokenExpiry: args.tokenExpiry,
    });
  },
});

// ============================================================================
// ACTIONS (HTTP calls to email providers)
// ============================================================================

type EmailAccountDoc = {
  _id: any;
  provider: "gmail" | "outlook";
  email: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: number;
  userId: any;
  isActive: boolean;
  connectedAt: number;
  lastSyncAt?: number;
};

type EmailDetailResult = {
  id: string;
  threadId: string;
  from: string;
  to: string;
  cc: string;
  subject: string;
  date: string;
  body: string;
  snippet: string;
  provider: "gmail" | "outlook";
  accountEmail: string;
};

const GMAIL_FOLDER_MAP: Record<string, string> = {
  inbox: "INBOX",
  sent: "SENT",
  trash: "TRASH",
};

const OUTLOOK_FOLDER_MAP: Record<string, string> = {
  inbox: "Inbox",
  sent: "SentItems",
  trash: "DeletedItems",
};

async function refreshGmailToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Gmail token refresh failed: ${res.status}`);
  const data = await res.json();
  return {
    accessToken: data.access_token as string,
    tokenExpiry: Date.now() + data.expires_in * 1000,
    refreshToken: (data.refresh_token as string) || refreshToken,
  };
}

async function refreshOutlookToken(refreshToken: string) {
  const res = await fetch(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        scope: "https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Calendars.Read offline_access",
      }),
    },
  );
  if (!res.ok)
    throw new Error(`Outlook token refresh failed: ${res.status}`);
  const data = await res.json();
  return {
    accessToken: data.access_token as string,
    tokenExpiry: Date.now() + data.expires_in * 1000,
    refreshToken: (data.refresh_token as string) || refreshToken,
  };
}

async function ensureValidToken(
  ctx: { runMutation: any },
  account: {
    _id: any;
    provider: "gmail" | "outlook";
    accessToken: string;
    refreshToken: string;
    tokenExpiry: number;
  },
) {
  if (Date.now() < account.tokenExpiry - 60_000) {
    return account.accessToken;
  }

  const refreshFn =
    account.provider === "gmail" ? refreshGmailToken : refreshOutlookToken;
  const tokens = await refreshFn(account.refreshToken);

  await ctx.runMutation(internal.emailAccounts.internalUpdateTokens, {
    accountId: account._id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenExpiry: tokens.tokenExpiry,
  });

  return tokens.accessToken;
}

async function fetchGmailMessages(
  accessToken: string,
  folder: string,
  limit: number,
  pageToken?: string,
) {
  const label = GMAIL_FOLDER_MAP[folder] || "INBOX";
  const params = new URLSearchParams({
    labelIds: label,
    maxResults: String(limit),
  });
  if (pageToken) params.set("pageToken", pageToken);

  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!listRes.ok) throw new Error(`Gmail list failed: ${listRes.status}`);
  const listData = await listRes.json();

  if (!listData.messages || listData.messages.length === 0) {
    return { messages: [], nextPageToken: null };
  }

  const messages = await Promise.all(
    listData.messages.map(async (msg: { id: string }) => {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!msgRes.ok) return null;
      const msgData = await msgRes.json();

      const headers = msgData.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find((h: { name: string }) => h.name.toLowerCase() === name.toLowerCase())
          ?.value || "";

      return {
        id: msgData.id,
        threadId: msgData.threadId,
        from: getHeader("From"),
        to: getHeader("To"),
        subject: getHeader("Subject"),
        date: getHeader("Date"),
        snippet: msgData.snippet || "",
        isRead: !msgData.labelIds?.includes("UNREAD"),
      };
    }),
  );

  return {
    messages: messages.filter(Boolean),
    nextPageToken: listData.nextPageToken || null,
  };
}

async function fetchOutlookMessages(
  accessToken: string,
  folder: string,
  limit: number,
  pageToken?: string,
) {
  const folderName = OUTLOOK_FOLDER_MAP[folder] || "Inbox";
  const params = new URLSearchParams({
    $top: String(limit),
    $select: "id,conversationId,from,toRecipients,subject,receivedDateTime,bodyPreview,isRead",
    $orderby: "receivedDateTime desc",
  });
  if (pageToken) params.set("$skip", pageToken);

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/mailFolders/${folderName}/messages?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) throw new Error(`Outlook list failed: ${res.status}`);
  const data = await res.json();

  const messages = (data.value || []).map(
    (msg: {
      id: string;
      conversationId: string;
      from: { emailAddress: { name: string; address: string } };
      toRecipients: Array<{ emailAddress: { name: string; address: string } }>;
      subject: string;
      receivedDateTime: string;
      bodyPreview: string;
      isRead: boolean;
    }) => ({
      id: msg.id,
      threadId: msg.conversationId,
      from: msg.from?.emailAddress
        ? `${msg.from.emailAddress.name} <${msg.from.emailAddress.address}>`
        : "",
      to: msg.toRecipients
        ?.map(
          (r) => `${r.emailAddress.name} <${r.emailAddress.address}>`,
        )
        .join(", ") || "",
      subject: msg.subject || "",
      date: msg.receivedDateTime || "",
      snippet: msg.bodyPreview || "",
      isRead: msg.isRead,
    }),
  );

  const nextSkip = data["@odata.nextLink"]
    ? String(parseInt(pageToken || "0") + limit)
    : null;

  return { messages, nextPageToken: nextSkip };
}

export const fetchEmails = action({
  args: {
    accountId: v.optional(v.id("emailAccounts")),
    folder: v.union(
      v.literal("inbox"),
      v.literal("sent"),
      v.literal("trash"),
    ),
    limit: v.optional(v.number()),
    pageToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const limit = args.limit ?? 20;
    const accounts: EmailAccountDoc[] = [];

    if (args.accountId) {
      const account = await ctx.runQuery(
        internal.emailAccounts.internalGetAccount,
        { accountId: args.accountId },
      );
      if (!account) throw new Error("Account not found");
      accounts.push(account);
    } else {
      const allAccounts = await ctx.runQuery(
        internal.emailAccounts.internalGetUserAccounts,
        { clerkUserId: identity.subject },
      );
      accounts.push(...allAccounts);
    }

    const results = await Promise.allSettled(
      accounts.map(async (account) => {
        const token = await ensureValidToken(ctx, account);
        const fetchFn =
          account.provider === "gmail"
            ? fetchGmailMessages
            : fetchOutlookMessages;
        const result = await fetchFn(token, args.folder, limit, args.pageToken ?? undefined);
        return {
          accountId: account._id,
          accountEmail: account.email,
          provider: account.provider,
          ...result,
        };
      }),
    );

    const allMessages: Array<{
      id: string;
      threadId: string;
      from: string;
      to: string;
      subject: string;
      date: string;
      snippet: string;
      isRead: boolean;
      accountId: string;
      accountEmail: string;
      provider: string;
    }> = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        for (const msg of result.value.messages) {
          allMessages.push({
            ...msg,
            accountId: result.value.accountId,
            accountEmail: result.value.accountEmail,
            provider: result.value.provider,
          });
        }
      }
    }

    allMessages.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return { messages: allMessages };
  },
});

async function fetchEmailDetailHandler(
  ctx: { auth: { getUserIdentity: () => Promise<any> }; runQuery: any; runMutation: any },
  args: { accountId: string; messageId: string },
): Promise<EmailDetailResult> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const account: EmailAccountDoc | null = await ctx.runQuery(
    internal.emailAccounts.internalGetAccount,
    { accountId: args.accountId },
  );
  if (!account) throw new Error("Account not found");

  const accessToken = await ensureValidToken(ctx, account);

  if (account.provider === "gmail") {
    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${args.messageId}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!res.ok) throw new Error(`Gmail detail failed: ${res.status}`);
    const data = await res.json();

    const headers = data.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h: { name: string }) => h.name.toLowerCase() === name.toLowerCase())
        ?.value || "";

    let body = "";
    const parts = data.payload?.parts || [];
    const htmlPart = parts.find(
      (p: { mimeType: string }) => p.mimeType === "text/html",
    );
    const textPart = parts.find(
      (p: { mimeType: string }) => p.mimeType === "text/plain",
    );

    if (htmlPart?.body?.data) {
      body = atob(htmlPart.body.data.replace(/-/g, "+").replace(/_/g, "/"));
    } else if (textPart?.body?.data) {
      body = atob(textPart.body.data.replace(/-/g, "+").replace(/_/g, "/"));
    } else if (data.payload?.body?.data) {
      body = atob(
        data.payload.body.data.replace(/-/g, "+").replace(/_/g, "/"),
      );
    }

    return {
      id: data.id as string,
      threadId: data.threadId as string,
      from: getHeader("From"),
      to: getHeader("To"),
      cc: getHeader("Cc"),
      subject: getHeader("Subject"),
      date: getHeader("Date"),
      body,
      snippet: (data.snippet || "") as string,
      provider: "gmail",
      accountEmail: account.email,
    };
  }

  // Outlook
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/messages/${args.messageId}?$select=id,conversationId,from,toRecipients,ccRecipients,subject,receivedDateTime,body,bodyPreview,isRead`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) throw new Error(`Outlook detail failed: ${res.status}`);
  const data = await res.json();

  return {
    id: data.id as string,
    threadId: (data.conversationId || "") as string,
    from: data.from?.emailAddress
      ? `${data.from.emailAddress.name} <${data.from.emailAddress.address}>`
      : "",
    to:
      data.toRecipients
        ?.map(
          (r: { emailAddress: { name: string; address: string } }) =>
            `${r.emailAddress.name} <${r.emailAddress.address}>`,
        )
        .join(", ") || "",
    cc:
      data.ccRecipients
        ?.map(
          (r: { emailAddress: { name: string; address: string } }) =>
            `${r.emailAddress.name} <${r.emailAddress.address}>`,
        )
        .join(", ") || "",
    subject: (data.subject || "") as string,
    date: (data.receivedDateTime || "") as string,
    body: (data.body?.content || "") as string,
    snippet: (data.bodyPreview || "") as string,
    provider: "outlook",
    accountEmail: account.email,
  };
}

export const fetchEmailDetail = action({
  args: {
    accountId: v.id("emailAccounts"),
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    return fetchEmailDetailHandler(ctx, args);
  },
});

async function archiveEmailHandler(
  ctx: { auth: { getUserIdentity: () => Promise<any> }; runQuery: any; runMutation: any },
  args: { accountId: string; messageId: string },
): Promise<{ archived: boolean; provider: "gmail" | "outlook" }> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const account: EmailAccountDoc | null = await ctx.runQuery(
    internal.emailAccounts.internalGetAccount,
    { accountId: args.accountId },
  );
  if (!account) throw new Error("Account not found");

  const accessToken = await ensureValidToken(ctx, account);

  if (account.provider === "gmail") {
    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${args.messageId}/modify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ removeLabelIds: ["INBOX"] }),
      },
    );
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Gmail archive failed (${res.status}): ${errorBody}`);
    }
  } else {
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages/${args.messageId}/move`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destinationId: "archive" }),
      },
    );
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Outlook archive failed (${res.status}): ${errorBody}`);
    }
  }

  return { archived: true, provider: account.provider };
}

export const archiveEmail = action({
  args: {
    accountId: v.id("emailAccounts"),
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    return archiveEmailHandler(ctx, args);
  },
});

// ============================================================================
// CALENDAR ACTIONS
// ============================================================================

type CalendarEventResult = {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  location: string;
  isAllDay: boolean;
  provider: "gmail" | "outlook";
  accountEmail: string;
  accountId: string;
  link: string;
};

async function fetchGoogleCalendarEvents(
  accessToken: string,
  timeMin: string,
  timeMax: string,
): Promise<Omit<CalendarEventResult, "provider" | "accountEmail" | "accountId">[]> {
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "100",
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Google Calendar API failed (${res.status}):`, errorBody);
    return [];
  }
  const data = await res.json();

  return (data.items || []).map(
    (event: {
      id: string;
      summary?: string;
      description?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
      location?: string;
      htmlLink?: string;
    }) => {
      const isAllDay = !event.start?.dateTime;
      const startStr = event.start?.dateTime || event.start?.date || "";
      const endStr = event.end?.dateTime || event.end?.date || "";

      return {
        id: event.id,
        title: event.summary || "(sem titulo)",
        description: event.description || "",
        startTime: new Date(startStr).getTime(),
        endTime: new Date(endStr).getTime(),
        location: event.location || "",
        isAllDay,
        link: event.htmlLink || "",
      };
    },
  );
}

async function fetchOutlookCalendarEvents(
  accessToken: string,
  timeMin: string,
  timeMax: string,
): Promise<Omit<CalendarEventResult, "provider" | "accountEmail" | "accountId">[]> {
  const params = new URLSearchParams({
    startDateTime: timeMin,
    endDateTime: timeMax,
    $top: "100",
    $select: "id,subject,bodyPreview,start,end,location,isAllDay,webLink",
    $orderby: "start/dateTime",
  });

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/calendarView?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Outlook Calendar API failed (${res.status}):`, errorBody);
    return [];
  }
  const data = await res.json();

  return (data.value || []).map(
    (event: {
      id: string;
      subject?: string;
      bodyPreview?: string;
      start?: { dateTime?: string; timeZone?: string };
      end?: { dateTime?: string; timeZone?: string };
      location?: { displayName?: string };
      isAllDay?: boolean;
      webLink?: string;
    }) => ({
      id: event.id,
      title: event.subject || "(sem titulo)",
      description: event.bodyPreview || "",
      startTime: new Date(event.start?.dateTime + "Z").getTime(),
      endTime: new Date(event.end?.dateTime + "Z").getTime(),
      location: event.location?.displayName || "",
      isAllDay: event.isAllDay || false,
      link: event.webLink || "",
    }),
  );
}

export const fetchCalendarEvents = action({
  args: {
    accountId: v.optional(v.id("emailAccounts")),
    timeMin: v.string(),
    timeMax: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const accounts: EmailAccountDoc[] = [];

    if (args.accountId) {
      const account: EmailAccountDoc | null = await ctx.runQuery(
        internal.emailAccounts.internalGetAccount,
        { accountId: args.accountId },
      );
      if (!account) throw new Error("Account not found");
      accounts.push(account);
    } else {
      const allAccounts = await ctx.runQuery(
        internal.emailAccounts.internalGetUserAccounts,
        { clerkUserId: identity.subject },
      );
      accounts.push(...allAccounts);
    }

    const results = await Promise.allSettled(
      accounts.map(async (account) => {
        const token = await ensureValidToken(ctx, account);
        const fetchFn =
          account.provider === "gmail"
            ? fetchGoogleCalendarEvents
            : fetchOutlookCalendarEvents;
        const events = await fetchFn(token, args.timeMin, args.timeMax);
        return events.map(
          (e): CalendarEventResult => ({
            ...e,
            provider: account.provider,
            accountEmail: account.email,
            accountId: account._id,
          }),
        );
      }),
    );

    const allEvents: CalendarEventResult[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allEvents.push(...result.value);
      }
    }

    allEvents.sort((a, b) => a.startTime - b.startTime);
    return { events: allEvents };
  },
});

// ============================================================================
// INTERNAL QUERIES (used by actions)
// ============================================================================

export const internalGetAccount = internalQuery({
  args: { accountId: v.id("emailAccounts") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.accountId);
  },
});

export const internalGetUserAccounts = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
    if (!user) return [];
    return ctx.db
      .query("emailAccounts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});
