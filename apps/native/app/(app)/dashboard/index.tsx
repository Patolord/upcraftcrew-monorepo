import { Ionicons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SalesFunnel from "./components/SalesFunnel";

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "goals" | "map">("dashboard");

  const projects = useQuery(api.projects.getProjects);
  const teamMembers = useQuery(api.team.getTeamMembers);
  const transactions = useQuery(api.finance.getTransactions);

  // Estado local para leads (você pode substituir por Convex depois)
  const [leads, setLeads] = useState<
    Array<{
      _id: string;
      name: string;
      company?: string;
      value: number;
      stage: "awareness" | "interest" | "decision" | "action";
      probability: number;
      lastContact?: string;
    }>
  >([
    {
      _id: "1",
      name: "Tech Solutions Corp",
      company: "Tech Solutions",
      value: 50000,
      stage: "awareness",
      probability: 20,
      lastContact: "Há 2 dias",
    },
    {
      _id: "2",
      name: "Digital Innovations Ltd",
      company: "Digital Innovations",
      value: 75000,
      stage: "awareness",
      probability: 25,
      lastContact: "Há 1 semana",
    },
    {
      _id: "3",
      name: "StartUp XYZ",
      company: "StartUp XYZ",
      value: 30000,
      stage: "interest",
      probability: 40,
      lastContact: "Ontem",
    },
    {
      _id: "4",
      name: "Enterprise Global",
      company: "Enterprise Global",
      value: 120000,
      stage: "interest",
      probability: 50,
      lastContact: "Há 3 dias",
    },
    {
      _id: "5",
      name: "Retail Chain Inc",
      company: "Retail Chain",
      value: 45000,
      stage: "decision",
      probability: 70,
      lastContact: "Hoje",
    },
    {
      _id: "6",
      name: "Finance Partners",
      company: "Finance Partners",
      value: 90000,
      stage: "decision",
      probability: 65,
      lastContact: "Há 1 dia",
    },
    {
      _id: "7",
      name: "Healthcare Systems",
      company: "Healthcare Systems",
      value: 60000,
      stage: "action",
      probability: 90,
      lastContact: "Hoje",
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Convex will auto-refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (projects === undefined || teamMembers === undefined || transactions === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white pt-10">
        <ActivityIndicator size="large" color="#FF5722" />
        <Text className="mt-4 text-gray-600">Loading dashboard...</Text>
      </View>
    );
  }

  // Calculate statistics
  const activeProjects = projects?.filter((p) => p.status === "in-progress").length || 0;
  const completedProjects = projects?.filter((p) => p.status === "completed").length || 0;
  const onlineMembers = teamMembers?.filter((m) => m.status === "online").length || 0;

  const completedTransactions = transactions?.filter((t) => t.status === "completed") || [];
  const totalIncome = completedTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = completedTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const averageProgress = projects?.length
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  return (
    <View className="flex-1 bg-gray-50 pt-16">
      {/* Header */}
      <View className="border-gray-200 border-b bg-white p-4">
        <Text className="mb-3 font-bold text-3xl text-orange-500">Dashboard</Text>

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
            onPress={() => setActiveTab("goals")}
            className={`flex-1 rounded-lg py-2 ${
              activeTab === "goals" ? "bg-orange-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "goals" ? "text-white" : "text-gray-700"
              }`}
            >
              Metas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("map")}
            className={`flex-1 rounded-lg py-2 ${
              activeTab === "map" ? "bg-orange-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "map" ? "text-white" : "text-gray-700"
              }`}
            >
              Sales Funnel
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="space-y-4 p-4">
          {activeTab === "dashboard" ? (
            /* Dashboard View */
            <>
              <View className="flex-row flex-wrap gap-3">
                <View className="min-w-[45%] flex-1 rounded-lg bg-white p-4 shadow">
                  <Text className="text-gray-500 text-sm">Active Projects</Text>
                  <Text className="mt-1 font-bold text-3xl text-orange-500">{activeProjects}</Text>
                  <Text className="mt-1 text-gray-400 text-xs">
                    of {projects?.length || 0} total
                  </Text>
                </View>

                <View className="min-w-[45%] flex-1 rounded-lg bg-white p-4 shadow">
                  <Text className="text-gray-500 text-sm">Total Revenue</Text>
                  <Text className="mt-1 font-bold text-3xl text-orange-500">
                    ${totalIncome.toLocaleString()}
                  </Text>
                  <Text className="mt-1 text-gray-400 text-xs">completed transactions</Text>
                </View>
              </View>

              {/* Recent Projects */}
              <View className="mt-4 rounded-lg bg-white p-4 shadow">
                <Text className="mb-3 font-semibold text-lg text-orange-500">Recent Projects</Text>
                {projects?.slice(0, 5).map((project, index) => (
                  <View
                    key={project._id}
                    className={`py-3 ${index !== 0 ? "border-gray-100 border-t" : ""}`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-800">{project.name}</Text>
                        <Text className="mt-1 text-gray-500 text-xs">{project.client}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="font-medium text-orange-500 text-sm">
                          {project.progress}%
                        </Text>
                        <View
                          className={`mt-1 rounded px-2 py-1 ${
                            project.status === "completed"
                              ? "bg-green-100"
                              : project.status === "in-progress"
                                ? "bg-blue-100"
                                : project.status === "planning"
                                  ? "bg-yellow-100"
                                  : "bg-gray-100"
                          }`}
                        >
                          <Text
                            className={`text-xs ${
                              project.status === "completed"
                                ? "text-green-700"
                                : project.status === "in-progress"
                                  ? "text-orange-700"
                                  : project.status === "planning"
                                    ? "text-yellow-700"
                                    : "text-gray-700"
                            }`}
                          >
                            {project.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Team Overview */}
              <View className="mt-4 rounded-lg bg-white p-4 shadow">
                <Text className="mb-3 font-semibold text-lg text-orange-500">Team Overview</Text>
                {teamMembers?.slice(0, 5).map((member, index) => (
                  <View
                    key={member._id}
                    className={`flex-row items-center py-3 ${index !== 0 ? "border-gray-100 border-t" : ""}`}
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                      <Text className="font-semibold text-orange-500">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </Text>
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-semibold text-gray-800">{member.name}</Text>
                      <Text className="text-gray-500 text-xs">{member.role}</Text>
                    </View>
                    <View
                      className={`h-3 w-3 rounded-full ${
                        member.status === "online"
                          ? "bg-green-500"
                          : member.status === "away"
                            ? "bg-yellow-500"
                            : member.status === "busy"
                              ? "bg-red-500"
                              : "bg-gray-300"
                      }`}
                    />
                  </View>
                ))}
              </View>
            </>
          ) : activeTab === "goals" ? (
            /* Goals View */
            <View className="space-y-4">
              <View className="rounded-lg bg-white p-4 shadow">
                <Text className="mb-3 font-semibold text-lg text-orange-500">Metas da Empresa</Text>

                <View className="space-y-4">
                  <View className="rounded-lg bg-blue-50 p-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="font-semibold text-gray-800">Receita Anual</Text>
                      <Ionicons name="trophy-outline" size={24} color="#FF5722" />
                    </View>
                    <Text className="mb-1 font-bold text-2xl text-orange-500">
                      ${totalIncome.toLocaleString()} / $500,000
                    </Text>
                    <View className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <View
                        className="h-full bg-orange-500"
                        style={{
                          width: `${Math.min((totalIncome / 500000) * 100, 100)}%`,
                        }}
                      />
                    </View>
                    <Text className="mt-2 text-gray-500 text-xs">
                      {Math.round((totalIncome / 500000) * 100)}% concluído
                    </Text>
                  </View>

                  <View className="rounded-lg bg-green-50 p-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="font-semibold text-gray-800">Projetos Completados</Text>
                      <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
                    </View>
                    <Text className="mb-1 font-bold text-2xl text-green-600">
                      {completedProjects} / 50
                    </Text>
                    <View className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <View
                        className="h-full bg-green-500"
                        style={{
                          width: `${Math.min((completedProjects / 50) * 100, 100)}%`,
                        }}
                      />
                    </View>
                    <Text className="mt-2 text-gray-500 text-xs">
                      {Math.round((completedProjects / 50) * 100)}% concluído
                    </Text>
                  </View>

                  <View className="rounded-lg bg-purple-50 p-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="font-semibold text-gray-800">Crescimento do Time</Text>
                      <Ionicons name="people-outline" size={24} color="#8B5CF6" />
                    </View>
                    <Text className="mb-1 font-bold text-2xl text-purple-600">
                      {teamMembers?.length || 0} / 20
                    </Text>
                    <View className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <View
                        className="h-full bg-purple-500"
                        style={{
                          width: `${Math.min(((teamMembers?.length || 0) / 20) * 100, 100)}%`,
                        }}
                      />
                    </View>
                    <Text className="mt-2 text-gray-500 text-xs">
                      {Math.round(((teamMembers?.length || 0) / 20) * 100)}% concluído
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            /* Sales Funnel View */
            <SalesFunnel
              leads={leads}
              onAddLead={(newLead) => {
                const lead = {
                  ...newLead,
                  _id: Date.now().toString(),
                };
                setLeads([...leads, lead]);
              }}
              onUpdateLead={(id, updates) => {
                setLeads(leads.map((lead) => (lead._id === id ? { ...lead, ...updates } : lead)));
              }}
              onDeleteLead={(id) => {
                setLeads(leads.filter((lead) => lead._id !== id));
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
