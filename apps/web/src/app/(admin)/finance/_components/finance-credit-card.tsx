"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontalIcon, ReceiptIcon, CarIcon, BookOpenIcon } from "lucide-react";
import React from "react";

interface RecentItem {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  date: string;
  amount: number;
}

interface FinanceCreditCardProps {
  balance?: number;
  recentItems?: RecentItem[];
}

// Mini gráfico decorativo SVG
const MiniWaveChart = () => (
  <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-10">
    <path
      d="M0 30 Q 10 20, 20 25 T 40 20 Q 50 15, 60 22 T 80 15"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Dados mockados para demonstração
const mockRecentItems: RecentItem[] = [
  {
    id: "1",
    icon: <ReceiptIcon className="size-4 text-indigo-600" />,
    iconBg: "bg-indigo-100",
    title: "Contas e Impostos",
    date: "Today, 16:36",
    amount: -154.5,
  },
  {
    id: "2",
    icon: <CarIcon className="size-4 text-amber-600" />,
    iconBg: "bg-amber-100",
    title: "Energia do Carro",
    date: "23 Jun, 13:06",
    amount: -40.5,
  },
  {
    id: "3",
    icon: <BookOpenIcon className="size-4 text-emerald-600" />,
    iconBg: "bg-emerald-100",
    title: "Curso de Design",
    date: "21 Jun, 19:04",
    amount: -70.0,
  },
];

export function FinanceCreditCard({
  balance = 25215,
  recentItems = mockRecentItems,
}: FinanceCreditCardProps) {
  const displayBalance = balance ?? 0;

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden">
      <CardContent className="p-0">
        {/* Credit Balance Section */}
        <div className="bg-linear-to-br from-brand via-brand/60 to-brand/30 p-5 rounded-xl mx-4 mt-4 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm font-medium">Saldo de Crédito</p>
              <button className="text-white/80 hover:text-white transition-colors">
                <MoreHorizontalIcon className="size-5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">
                ${displayBalance.toLocaleString()}
              </span>
              <MiniWaveChart />
            </div>
          </div>
        </div>

        {/* Recent Section */}
        <div className="p-4 pt-5">
          <p className="text-sm text-gray-500 font-medium mb-4">Recente</p>
          <div className="space-y-4">
            {recentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${item.iconBg}`}>{item.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  -${Math.abs(item.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
