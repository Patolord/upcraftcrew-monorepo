import { CoverPage } from "./cover-page";
import { IndexPage } from "./index-page";
import { AboutPage } from "./about-page";
import { ObjectivesPage } from "./objectives-page";
import { ScopePage } from "./scope-page";
import { InvestmentPage } from "./investment-page";
import type { Budget } from "./types";

interface BudgetPDFTemplateProps {
  budget: Budget;
}

export function BudgetPDFTemplate({ budget }: BudgetPDFTemplateProps) {
  return (
    <div className="pdf-document">
      {/* Page 1 - Cover */}
      <div className="pdf-page">
        <CoverPage budget={budget} />
      </div>

      {/* Page 2 - Index */}
      <div className="pdf-page">
        <IndexPage />
      </div>

      {/* Page 3 - About */}
      <div className="pdf-page">
        <AboutPage />
      </div>

      {/* Page 4 - Objectives */}
      <div className="pdf-page">
        <ObjectivesPage budget={budget} />
      </div>

      {/* Page 5 - Scope */}
      <div className="pdf-page">
        <ScopePage budget={budget} />
      </div>

      {/* Page 6 - Investment */}
      <div className="pdf-page">
        <InvestmentPage budget={budget} />
      </div>

      <style>{`
        .pdf-document {
          font-family: 'Helvetica', 'Arial', sans-serif;
        }
        .pdf-page {
          page-break-after: always;
          page-break-inside: avoid;
        }
        .pdf-page:last-child {
          page-break-after: auto;
        }
        @media print {
          .pdf-page {
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}

export type { Budget, PDFTemplateProps as BudgetPDFTemplateProps } from "./types";
