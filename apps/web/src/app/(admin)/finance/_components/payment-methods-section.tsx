"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface PaymentMethod {
  id: string;
  type: "mastercard" | "visa";
  cardNumber: string;
  expiry: string;
}

interface PaymentMethodsSectionProps {
  paymentMethods?: PaymentMethod[];
  onAddMethod?: () => void;
  onEditMethod?: (id: string) => void;
  onDeleteMethod?: (id: string) => void;
}

// Mock data
const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "mastercard",
    cardNumber: "**** **** **** 5834",
    expiry: "12/23",
  },
  {
    id: "2",
    type: "visa",
    cardNumber: "**** **** **** 5834",
    expiry: "11/23",
  },
];

const cardConfig = {
  mastercard: {
    name: "Master Card",
    logo: "💳",
    bgColor: "bg-gradient-to-br from-orange-400 to-orange-500",
  },
  visa: {
    name: "Visa Card",
    logo: "💳",
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
};

export function PaymentMethodsSection({
  paymentMethods = defaultPaymentMethods,
  onAddMethod,
  onEditMethod,
  onDeleteMethod,
}: PaymentMethodsSectionProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b bg-muted/5">
        <CardTitle className="text-lg font-semibold">Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {paymentMethods.map((method) => {
          const config = cardConfig[method.type];

          return (
            <div key={method.id} className="space-y-3">
              {/* Card visualization */}
              <div className={cn("relative h-36 rounded-xl p-6 text-white", config.bgColor)}>
                <div className="flex items-start justify-between mb-8">
                  <span className="text-2xl">{config.logo}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-white/20"
                    onClick={() => onDeleteMethod?.(method.id)}
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium tracking-wider">{method.cardNumber}</div>
                  <div className="text-xs">Expire {method.expiry}</div>
                </div>
              </div>

              {/* Card info and action */}
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">{config.name}</div>
                  <div className="text-muted-foreground">{method.cardNumber}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  onClick={() => onEditMethod?.(method.id)}
                >
                  Edit Account info
                </Button>
              </div>

              {/* Visa logo badge */}
              {method.type === "visa" && (
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                    VISA
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add new method button */}
        <Button
          variant="outline"
          className="w-full border-dashed border-2 h-12 text-orange-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
          onClick={onAddMethod}
        >
          Add new method
        </Button>
      </CardContent>
    </Card>
  );
}
