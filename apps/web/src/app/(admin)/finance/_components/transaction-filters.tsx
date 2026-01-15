"use client";

import type { TransactionCategory, TransactionType } from "@/types/finance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="project-payment">Project Payment</SelectItem>
          <SelectItem value="salary">Salary</SelectItem>
          <SelectItem value="software">Software</SelectItem>
          <SelectItem value="equipment">Equipment</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="office">Office</SelectItem>
          <SelectItem value="consultant">Consultant</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
