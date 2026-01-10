export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "project-payment"
  | "salary"
  | "subscription"
  | "equipment"
  | "marketing"
  | "office"
  | "software"
  | "consultant"
  | "other";

export type PaymentStatus = "pending" | "completed";

export type Transaction = {
  id: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  status: PaymentStatus;
  date: string; // ISO date
  projectId?: string;
  projectName?: string;
  client?: string;
  paymentMethod?: string;
  invoiceNumber?: string;
};

export type FinancialSummary = {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingIncome: number;
  pendingExpenses: number;
};

export type TransactionForm = {
  props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
    mode: "create" | "edit";
  };
};
