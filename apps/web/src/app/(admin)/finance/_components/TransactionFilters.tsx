import type { TransactionCategory, TransactionType } from "@/types/finance";

interface TransactionFiltersProps {
  typeFilter: TransactionType | "all";
  categoryFilter: TransactionCategory | "all";
  statusFilter: "all" | "completed" | "pending";
  onTypeFilterChange: (value: TransactionType | "all") => void;
  onCategoryFilterChange: (value: TransactionCategory | "all") => void;
  onStatusFilterChange: (value: "all" | "completed" | "pending") => void;
}

export function TransactionFilters({
  typeFilter,
  categoryFilter,
  statusFilter,
  onTypeFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        className="select select-bordered select-sm"
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value as TransactionType | "all")}
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        className="select select-bordered select-sm"
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value as TransactionCategory | "all")}
      >
        <option value="all">All Categories</option>
        <option value="project-payment">Project Payment</option>
        <option value="salary">Salary</option>
        <option value="software">Software</option>
        <option value="equipment">Equipment</option>
        <option value="marketing">Marketing</option>
        <option value="office">Office</option>
        <option value="consultant">Consultant</option>
        <option value="other">Other</option>
      </select>

      <select
        className="select select-bordered select-sm"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as "all" | "completed" | "pending")}
      >
        <option value="all">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
}
