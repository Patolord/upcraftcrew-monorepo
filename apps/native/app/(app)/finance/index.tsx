import { Ionicons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { NewTransactionModal } from "@/components/modals/NewTransactionModal";

export default function FinancePage() {
  const transactions = useQuery(api.finance.getTransactions);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((transaction) => {
      const matchesType = typeFilter === "all" || transaction.type === typeFilter;
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [transactions, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    if (!transactions) return { income: 0, expenses: 0, profit: 0, pending: 0 };

    const completed = transactions.filter((t) => t.status === "completed");
    const income = completed
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = completed
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const pending = transactions
      .filter((t) => t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      profit: income - expenses,
      pending,
    };
  }, [transactions]);

  if (transactions === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5722" />
        <Text className="mt-4 text-gray-600">Loading finance...</Text>
      </View>
    );
  }

  const typeOptions = [
    { label: "All", value: "all" },
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
  ];

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
  ];

  return (
    <View className="flex-1 pt-16 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="gap-4 p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-3xl text-orange-500">Finance</Text>
            <TouchableOpacity
              onPress={() => setIsNewTransactionModalOpen(true)}
              className="rounded-lg bg-orange-500 px-4 py-2"
            >
              <Text className="font-semibold text-white">+ New Transaction</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Total Income</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">
                ${stats.income.toLocaleString()}
              </Text>
            </View>
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Total Expenses</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">
                ${stats.expenses.toLocaleString()}
              </Text>
            </View>
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Net Profit</Text>
              <Text
                className={`mt-1 font-bold text-2xl ${stats.profit >= 0 ? "text-orange-500" : "text-orange-500"}`}
              >
                ${stats.profit.toLocaleString()}
              </Text>
            </View>
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Pending</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">
                ${stats.pending.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Filters */}
          <View className="rounded-lg border border-orange-500 bg-white p-4">
            <Text className="mb-3 font-semibold text-gray-700 text-sm">Filters</Text>

            {/* Type Filter */}
            <Text className="mb-2 text-gray-500 text-xs">Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
              contentContainerClassName="gap-3"
            >
              {typeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setTypeFilter(option.value)}
                  className={`rounded-full px-4 py-2 ${
                    typeFilter === option.value ? "bg-orange-500" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-medium text-sm ${
                      typeFilter === option.value ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Status Filter */}
            <Text className="mb-2 text-gray-500 text-xs">Status</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
            >
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setStatusFilter(option.value)}
                  className={`rounded-full px-4 py-2 ${
                    statusFilter === option.value ? "bg-orange-500" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-medium text-sm ${
                      statusFilter === option.value ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Transactions List */}
          <View>
            <Text className="mb-3 font-semibold text-lg text-orange-500">Transactions</Text>
            <View className="gap-4">
              {filteredTransactions.map((transaction) => (
                <View
                  key={transaction._id}
                  className="rounded-lg border border-orange-500 bg-white p-4"
                >
                  {/* Header */}
                  <View className="mb-2 flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-800 text-lg">
                        {transaction.description}
                      </Text>
                      {transaction.projectId && "project" in transaction && transaction.project && (
                        <Text className="mt-1 text-gray-500 text-sm">
                          {transaction.project.name}
                        </Text>
                      )}
                    </View>
                    <Text
                      className={`font-bold text-lg ${
                        transaction.type === "income" ? "text-orange-500" : "text-orange-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toLocaleString()}
                    </Text>
                  </View>

                  {/* Description */}
                  {transaction.description && (
                    <Text className="mb-3 text-gray-600 text-sm" numberOfLines={2}>
                      {transaction.description}
                    </Text>
                  )}

                  {/* Details */}
                  <View className="flex-row flex-wrap gap-x-4 gap-y-2">
                    {/* Category */}
                    <View className="flex-row items-center">
                      <Ionicons name="pricetag-outline" size={14} color="#9ca3af" />
                      <Text className="ml-1 text-gray-600 text-xs capitalize">
                        {transaction.category?.replace("-", " ")}
                      </Text>
                    </View>

                    {/* Date */}
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                      <Text className="ml-1 text-gray-600 text-xs">
                        {new Date(transaction.date).toLocaleDateString()}
                      </Text>
                    </View>

                    {/* Client */}
                    {transaction.clientId && (
                      <View className="flex-row items-center">
                        <Ionicons name="person-outline" size={14} color="#9ca3af" />
                        <Text className="ml-1 text-gray-600 text-xs">{transaction.clientId}</Text>
                      </View>
                    )}

                    {/* Transaction ID */}
                    <View className="flex-row items-center">
                      <Ionicons name="document-text-outline" size={14} color="#9ca3af" />
                      <Text className="ml-1 text-gray-600 text-xs">ID: {transaction._id}</Text>
                    </View>
                  </View>

                  {/* Status Badge */}
                  <View className="mt-3">
                    <View
                      className={`self-start rounded-full px-3 py-1 ${
                        transaction.status === "completed"
                          ? "bg-green-100"
                          : transaction.status === "pending"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                      }`}
                    >
                      <Text
                        className={`font-medium text-xs ${
                          transaction.status === "completed"
                            ? "text-green-700"
                            : transaction.status === "pending"
                              ? "text-yellow-700"
                              : "text-red-700"
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {filteredTransactions.length === 0 && (
              <View className="items-center rounded-lg border border-orange-500 bg-white p-8">
                <Ionicons name="cash-outline" size={48} color="#d1d5db" />
                <Text className="mt-4 text-gray-500">No transactions found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
      />
    </View>
  );
}
