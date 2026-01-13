import { Ionicons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { NewBudgetModal } from "@/components/modals/NewBudgetModal";

export default function BudgetsPage() {
  const budgets = useQuery(api.budgets.getBudgets);
  const budgetStats = useQuery(api.budgets.getBudgetStats);
  const [activeTab, setActiveTab] = useState<"dashboard" | "all">("dashboard");
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);

  if (budgets === undefined || budgetStats === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5722" />
        <Text className="mt-4 text-gray-600">Loading budgets...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-16 ">
      {/* Header */}
      <View className="border-gray-200 border-b p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="font-bold text-3xl text-orange-500">Budgets</Text>
          {activeTab === "all" && (
            <TouchableOpacity
              onPress={() => setIsNewBudgetModalOpen(true)}
              className="rounded-lg bg-orange-500 px-4 py-2"
            >
              <Text className="font-semibold text-white">+ New Budget</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Navigation */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setActiveTab("dashboard")}
            className={`flex-1 rounded-lg py-2 ${
              activeTab === "dashboard" ? "bg-orange-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "dashboard" ? "text-white" : "text-gray-700"
              }`}
            >
              Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("all")}
            className={`flex-1 rounded-lg py-2 ${
              activeTab === "all" ? "bg-orange-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "all" ? "text-white" : "text-gray-700"
              }`}
            >
              All Budgets
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="gap-4 p-4">
          {activeTab === "dashboard" ? (
            /* Dashboard View */
            <>
              {/* Stats Cards */}
              {budgetStats && (
                <View className="flex-row flex-wrap gap-3">
                  <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-4">
                    <Text className="text-gray-500 text-sm">Total Budgets</Text>
                    <Text className="mt-1 font-bold text-3xl text-orange-500">
                      {budgetStats.total || 0}
                    </Text>
                  </View>
                  <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-4">
                    <Text className="text-gray-500 text-sm">Approved</Text>
                    <Text className="mt-1 font-bold text-3xl text-orange-500">
                      {budgetStats.approved || 0}
                    </Text>
                  </View>
                  <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-4">
                    <Text className="text-gray-500 text-sm">Pending</Text>
                    <Text className="mt-1 font-bold text-3xl text-orange-500">
                      {budgetStats.sent || 0}
                    </Text>
                  </View>
                  <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-4">
                    <Text className="text-gray-500 text-sm">Total Value</Text>
                    <Text className="mt-1 font-bold text-3xl text-orange-500">
                      ${(budgetStats.totalValue || 0).toLocaleString()}
                    </Text>
                  </View>
                </View>
              )}

              {/* Recent Budgets */}
              <View className="rounded-lg border border-orange-500 bg-white p-4">
                <Text className="mb-3 font-semibold text-lg text-orange-500">Recent Budgets</Text>
                {budgets?.slice(0, 5).map((budget, index) => (
                  <View
                    key={budget._id}
                    className={`py-3 ${index !== 0 ? "border-gray-100 border-t" : ""}`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-800">{budget.client}</Text>
                        <Text className="mt-1 text-gray-500 text-xs">{budget.title}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="font-bold text-orange-500 text-sm">
                          ${budget.totalAmount?.toLocaleString()}
                        </Text>
                        <View
                          className={`mt-1 rounded px-2 py-1 ${
                            budget.status === "approved"
                              ? "bg-green-100"
                              : budget.status === "sent"
                                ? "bg-yellow-100"
                                : budget.status === "rejected"
                                  ? "bg-red-100"
                                  : "bg-gray-100"
                          }`}
                        >
                          <Text
                            className={`text-xs ${
                              budget.status === "approved"
                                ? "text-green-700"
                                : budget.status === "sent"
                                  ? "text-yellow-700"
                                  : budget.status === "rejected"
                                    ? "text-red-700"
                                    : "text-gray-700"
                            }`}
                          >
                            {budget.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            /* All Budgets View */
            <View className="gap-4">
              {budgets?.map((budget) => (
                <View key={budget._id} className="rounded-lg border border-orange-500 bg-white p-4">
                  {/* Header */}
                  <View className="mb-3 flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-800 text-lg">{budget.title}</Text>
                      <Text className="mt-1 text-gray-500 text-sm">{budget.client}</Text>
                    </View>
                    <View
                      className={`rounded-full px-3 py-1 ${
                        budget.status === "approved"
                          ? "bg-green-100"
                          : budget.status === "sent"
                            ? "bg-yellow-100"
                            : budget.status === "rejected"
                              ? "bg-red-100"
                              : budget.status === "draft"
                                ? "bg-gray-100"
                                : "bg-blue-100"
                      }`}
                    >
                      <Text
                        className={`font-medium text-xs ${
                          budget.status === "approved"
                            ? "text-green-700"
                            : budget.status === "sent"
                              ? "text-yellow-700"
                              : budget.status === "rejected"
                                ? "text-red-700"
                                : budget.status === "draft"
                                  ? "text-gray-700"
                                  : "text-blue-700"
                        }`}
                      >
                        {budget.status?.charAt(0).toUpperCase() + budget.status?.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  {budget.description && (
                    <Text className="mb-3 text-gray-600 text-sm" numberOfLines={2}>
                      {budget.description}
                    </Text>
                  )}

                  {/* Budget Details */}
                  <View className="space-y-2">
                    {/* Amount */}
                    <View className="flex-row items-center justify-between border-gray-100 border-t py-2">
                      <Text className="text-gray-600 text-sm">Total Amount</Text>
                      <Text className="font-bold text-lg text-orange-500">
                        ${budget.totalAmount?.toLocaleString()}
                      </Text>
                    </View>

                    {/* Items Count */}
                    {budget.items && budget.items.length > 0 && (
                      <View className="flex-row items-center">
                        <Ionicons name="list-outline" size={16} color="#9ca3af" />
                        <Text className="ml-2 text-gray-600 text-sm">
                          {budget.items.length} item
                          {budget.items.length > 1 ? "s" : ""}
                        </Text>
                      </View>
                    )}

                    {/* Created Date */}
                    {budget.createdAt && (
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
                        <Text className="ml-2 text-gray-600 text-sm">
                          Created: {new Date(budget.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    )}

                    {/* Valid Until */}
                    {budget.validUntil && (
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={16} color="#9ca3af" />
                        <Text className="ml-2 text-gray-600 text-sm">
                          Valid until: {new Date(budget.validUntil).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity className="mt-3 rounded-lg bg-blue-50 py-2">
                    <Text className="text-center font-medium text-blue-600">View Details</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {(!budgets || budgets.length === 0) && (
                <View className="items-center rounded-lg border border-orange-500 bg-white p-8">
                  <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
                  <Text className="mt-4 text-gray-500">No budgets found</Text>
                  <Text className="mt-2 text-gray-400 text-sm">
                    Create your first budget to get started
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <NewBudgetModal
        isOpen={isNewBudgetModalOpen}
        onClose={() => setIsNewBudgetModalOpen(false)}
      />
    </View>
  );
}
