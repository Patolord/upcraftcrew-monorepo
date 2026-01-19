import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { fetchQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { renderToHTML } from "@/lib/pdf-renderer";
import { BudgetPDFTemplate } from "../../_components/pdf-template";
import type { Budget } from "../../_components/pdf-template/types";
import { getConvexToken } from "@/lib/server-auth";

// HTML wrapper for the PDF template
function getHTMLDocument(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Proposta Comercial</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica', 'Arial', sans-serif;
          }
          .pdf-page {
            width: 794px;
            height: 1123px;
            page-break-after: always;
            page-break-inside: avoid;
            overflow: hidden;
          }
          .pdf-page:last-child {
            page-break-after: auto;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get authentication token
    const token = await getConvexToken();
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHENTICATED" },
        { status: 401 },
      );
    }

    // Fetch budget data from Convex with authentication
    const budgetData = await fetchQuery(
      api.budgets.getBudgetById,
      { id: id as Id<"budgets"> },
      { token },
    );

    if (!budgetData) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Transform to Budget type
    const budget: Budget = {
      _id: budgetData._id,
      title: budgetData.title,
      client: budgetData.client,
      description: budgetData.description,
      status: budgetData.status,
      totalAmount: budgetData.totalAmount,
      currency: budgetData.currency,
      items: budgetData.items,
      validUntil: budgetData.validUntil,
      createdAt: budgetData.createdAt,
      updatedAt: budgetData.updatedAt,
      projectId: budgetData.projectId,
      notes: budgetData.notes,
      objectives: budgetData.objectives,
      scopeOptions: budgetData.scopeOptions,
      extras: budgetData.extras,
      paymentTerms: budgetData.paymentTerms,
      deliveryDeadline: budgetData.deliveryDeadline,
    };

    // Render React component to static HTML
    const reactMarkup = renderToHTML(BudgetPDFTemplate({ budget }));
    const htmlDocument = getHTMLDocument(reactMarkup);

    // Launch Playwright browser and generate PDF
    const browser = await chromium.launch({
      headless: true,
    });
    const page = await browser.newPage();

    // Set content and wait for it to load
    await page.setContent(htmlDocument, {
      waitUntil: "networkidle",
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    await browser.close();

    // Return PDF response (convert Buffer to Uint8Array for NextResponse compatibility)
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="proposta-${budget.title.toLowerCase().replace(/\s+/g, "-")}.pdf"`,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate PDF";

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        message: errorMessage,
        code: "PDF_GENERATION_ERROR",
      },
      { status: 500 },
    );
  }
}
