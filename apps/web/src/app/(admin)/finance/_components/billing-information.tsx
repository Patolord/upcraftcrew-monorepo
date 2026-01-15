"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface BillingInfo {
  companyName: string;
  email: string;
  vatNumber: string;
}

interface BillingInformationProps {
  billingInfo?: BillingInfo;
  onEdit?: () => void;
}

// Mock data
const defaultBillingInfo: BillingInfo = {
  companyName: "Viking Burrito sons",
  email: "Oliver.burrito.viking@gmail.com",
  vatNumber: "FRB462858254",
};

export function BillingInformation({
  billingInfo = defaultBillingInfo,
  onEdit,
}: BillingInformationProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b bg-muted/5">
        <CardTitle className="text-lg font-semibold">Billing Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* First billing entry */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32">Company name:</span>
                <span className="text-sm font-medium text-foreground">
                  {billingInfo.companyName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32">Email address:</span>
                <span className="text-sm font-medium text-foreground">{billingInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32">VAT number:</span>
                <span className="text-sm font-medium text-foreground">{billingInfo.vatNumber}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                <Pencil className="h-4 w-4 text-orange-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Second billing entry (duplicate for demo) */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32">Company name:</span>
                <span className="text-sm font-medium text-foreground">
                  {billingInfo.companyName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32">Email address:</span>
                <span className="text-sm font-medium text-foreground">{billingInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32">VAT number:</span>
                <span className="text-sm font-medium text-foreground">{billingInfo.vatNumber}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                <Pencil className="h-4 w-4 text-orange-500" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
