"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from "react";

interface FinanceInvoice {
  id: string;
  name: string;
  invoiceNumber: string;
  date: string;
  price: number;
}

interface FinanceInvoicesProps {
  invoices?: FinanceInvoice[];
}

export function FinanceInvoices({ invoices = [] }: FinanceInvoicesProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b bg-muted/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Faturas</CardTitle>
          <Button variant="link" className="text-orange-500 hover:text-orange-600">
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">PDF</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-400 flex items-center justify-center text-white font-medium">
                      {invoice.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{invoice.name}</div>
                      <div className="text-xs text-muted-foreground">{invoice.invoiceNumber}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                <TableCell className="font-medium">R${invoice.price}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
