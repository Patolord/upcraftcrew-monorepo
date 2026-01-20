"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Transfer {
  id: string;
  name: string;
  avatar?: string;
  date: string;
  amount: number;
  type: "incoming" | "outgoing";
}

interface FinanceTransfersCardProps {
  transfers?: Transfer[];
}

// Dados mockados para demonstração
const mockTransfers: Transfer[] = [
  {
    id: "1",
    name: "Alex Manda",
    avatar: "/images/avatars/1.png",
    date: "Today, 16:36",
    amount: 50,
    type: "incoming",
  },
  {
    id: "2",
    name: "Laura Santos",
    avatar: "/images/avatars/2.png",
    date: "Today, 08:49",
    amount: 27,
    type: "outgoing",
  },
  {
    id: "3",
    name: "Jadon S.",
    avatar: "/images/avatars/3.png",
    date: "Yesterday, 14:36",
    amount: 157,
    type: "incoming",
  },
];

export function FinanceTransfersCard({ transfers = mockTransfers }: FinanceTransfersCardProps) {
  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-full">
      <CardContent>
        {/* Header */}
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Transfers</h3>

        {/* Transfers List */}
        <div className="space-y-5">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={transfer.avatar} alt={transfer.name} />
                  <AvatarFallback className="bg-violet-100 text-violet-600 font-medium">
                    {transfer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">
                    {transfer.type === "incoming" ? "From " : "To "}
                    {transfer.name}
                  </p>
                  <p className="text-sm text-gray-500">{transfer.date}</p>
                </div>
              </div>
              <span
                className={`font-semibold text-base ${
                  transfer.type === "incoming" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {transfer.type === "incoming" ? "+" : "-"}${transfer.amount}
              </span>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <Link
          href="/finance/transfers"
          className="flex items-center justify-end gap-2 mt-6 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
        >
          View all
          <ArrowRightIcon className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
