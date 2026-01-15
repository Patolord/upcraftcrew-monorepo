"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodCardProps {
  name: string;
  type: "salary" | "paypal" | "other";
  amount: number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const paymentMethodConfig = {
  salary: {
    bgColor: "bg-emerald-400",
    icon: "💼",
  },
  paypal: {
    bgColor: "bg-pink-400",
    icon: "🅿️",
  },
  other: {
    bgColor: "bg-blue-400",
    icon: "💳",
  },
};

export function PaymentMethodCard({
  name,
  type,
  amount,
  description,
  icon,
  className,
}: PaymentMethodCardProps) {
  const config = paymentMethodConfig[type] || paymentMethodConfig.other;

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl",
                config.bgColor,
              )}
            >
              {icon || config.icon}
            </div>

            {/* Content */}
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{name}</h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold text-foreground">${amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
