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

interface Invoice {
  id: string;
  name: string;
  invoiceNumber: string;
  date: string;
  price: number;
}

interface InvoicesTableProps {
  invoices?: Invoice[];
}

// Mock data for demonstration
const mockInvoices: Invoice[] = [
  {
    id: "1",
    name: "Watch",
    invoiceNumber: "#EL-150255",
    date: "2/5/2022",
    price: 130,
  },
  {
    id: "2",
    name: "Camera",
    invoiceNumber: "#EL-156254",
    date: "1/5/2022",
    price: 120,
  },
  {
    id: "3",
    name: "Mouse",
    invoiceNumber: "#EL-158263",
    date: "30/4/2022",
    price: 150,
  },
];

export function InvoicesTable({ invoices = mockInvoices }: InvoicesTableProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b bg-muted/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Invoices</CardTitle>
          <Button variant="link" className="text-orange-500 hover:text-orange-600">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
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
                <TableCell className="font-medium">${invoice.price}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
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
