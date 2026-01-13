import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface Lead {
  _id: string;
  name: string;
  company?: string;
  value: number;
  stage: "awareness" | "interest" | "decision" | "action";
  probability: number;
  lastContact?: string;
}

interface SalesFunnelProps {
  leads?: Lead[];
  onAddLead?: (lead: Omit<Lead, "_id">) => void;
  onUpdateLead?: (id: string, updates: Partial<Lead>) => void;
  onDeleteLead?: (id: string) => void;
}

export default function SalesFunnel({
  leads = [],
  onAddLead,
  onUpdateLead,
  onDeleteLead,
}: SalesFunnelProps) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    value: "",
    stage: "awareness" as Lead["stage"],
    probability: "",
  });

  // Organize leads by stage
  const leadsByStage = {
    awareness: leads.filter((l) => l.stage === "awareness"),
    interest: leads.filter((l) => l.stage === "interest"),
    decision: leads.filter((l) => l.stage === "decision"),
    action: leads.filter((l) => l.stage === "action"),
  };

  // Calculate totals
  const totals = {
    awareness: leadsByStage.awareness.reduce((sum, l) => sum + l.value, 0),
    interest: leadsByStage.interest.reduce((sum, l) => sum + l.value, 0),
    decision: leadsByStage.decision.reduce((sum, l) => sum + l.value, 0),
    action: leadsByStage.action.reduce((sum, l) => sum + l.value, 0),
  };

  const stages = [
    {
      id: "awareness",
      title: "Conscientização",
      description: "Potenciais clientes descobrindo sua marca",
      color: "#3B82F6",
      icon: "eye-outline" as const,
      count: leadsByStage.awareness.length,
      value: totals.awareness,
    },
    {
      id: "interest",
      title: "Interesse",
      description: "Leads demonstrando interesse ativo",
      color: "#10B981",
      icon: "heart-outline" as const,
      count: leadsByStage.interest.length,
      value: totals.interest,
    },
    {
      id: "decision",
      title: "Decisão",
      description: "Avaliando e comparando soluções",
      color: "#F59E0B",
      icon: "analytics-outline" as const,
      count: leadsByStage.decision.length,
      value: totals.decision,
    },
    {
      id: "action",
      title: "Ação",
      description: "Prontos para fechar negócio",
      color: "#EF4444",
      icon: "checkmark-circle-outline" as const,
      count: leadsByStage.action.length,
      value: totals.action,
    },
  ];

  const getStageLeads = (stageId: string) => {
    return leadsByStage[stageId as keyof typeof leadsByStage] || [];
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      value: "",
      stage: "awareness",
      probability: "",
    });
    setEditingLead(null);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert("Erro", "Nome do lead é obrigatório");
      return;
    }

    const leadData = {
      name: formData.name,
      company: formData.company || undefined,
      value: Number.parseFloat(formData.value) || 0,
      stage: formData.stage,
      probability: Number.parseInt(formData.probability) || 0,
      lastContact: new Date().toLocaleDateString("pt-BR"),
    };

    if (editingLead) {
      onUpdateLead?.(editingLead._id, leadData);
    } else {
      onAddLead?.(leadData);
    }

    resetForm();
    setIsAddModalVisible(false);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      company: lead.company || "",
      value: lead.value.toString(),
      stage: lead.stage,
      probability: lead.probability.toString(),
    });
    setIsAddModalVisible(true);
    setSelectedStage(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "Deseja realmente excluir este lead?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          onDeleteLead?.(id);
          setSelectedStage(null);
        },
      },
    ]);
  };

  const handleMoveStage = (leadId: string, newStage: Lead["stage"]) => {
    onUpdateLead?.(leadId, { stage: newStage });
  };

  return (
    <View className="space-y-4">
      {/* Header */}
      <View className="rounded-lg bg-white p-4 shadow">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-semibold text-lg text-orange-500">Funil de Vendas</Text>
          <TouchableOpacity
            onPress={() => {
              resetForm();
              setIsAddModalVisible(true);
            }}
            className="rounded-lg bg-orange-500 px-3 py-2"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="add" size={20} color="white" />
              <Text className="font-semibold text-white text-sm">Novo Lead</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-600 text-sm">
          Visualize e gerencie suas oportunidades de vendas em cada etapa do funil
        </Text>
      </View>

      {/* Funnel Stages */}
      <View className="space-y-3">
        {stages.map((stage, index) => {
          const totalLeads = leads.length;
          const conversionRate = totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0;
          const width = 100 - index * 15; // Diminui 15% a cada estágio para dar efeito de funil

          return (
            <TouchableOpacity
              key={stage.id}
              onPress={() => setSelectedStage(stage.id)}
              className="items-center"
            >
              <View
                className="rounded-lg border-2 bg-white p-4 shadow"
                style={{
                  borderColor: stage.color,
                  width: `${width}%`,
                }}
              >
                <View className="mb-2 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name={stage.icon} size={20} color={stage.color} />
                    <Text className="font-bold" style={{ color: stage.color }}>
                      {stage.title}
                    </Text>
                  </View>
                  <View
                    className="rounded-full px-2 py-1"
                    style={{ backgroundColor: `${stage.color}20` }}
                  >
                    <Text className="font-semibold text-xs" style={{ color: stage.color }}>
                      {stage.count}
                    </Text>
                  </View>
                </View>

                <Text className="mb-3 text-gray-600 text-xs">{stage.description}</Text>

                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-gray-500 text-xs">Valor Total</Text>
                    <Text className="font-bold" style={{ color: stage.color }}>
                      ${stage.value.toLocaleString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-500 text-xs">Taxa Conversão</Text>
                    <Text className="font-bold" style={{ color: stage.color }}>
                      {conversionRate.toFixed(1)}%
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                {index < stages.length - 1 && (
                  <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <View
                      className="h-full"
                      style={{
                        backgroundColor: stage.color,
                        width: `${(stage.count / (stages[index + 1]?.count || 1)) * 100}%`,
                      }}
                    />
                  </View>
                )}
              </View>

              {/* Arrow connector */}
              {index < stages.length - 1 && (
                <View className="my-2">
                  <Ionicons name="chevron-down" size={24} color="#9CA3AF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Summary Stats */}
      <View className="rounded-lg bg-white p-4 shadow">
        <Text className="mb-3 font-semibold text-gray-800">Resumo do Funil</Text>
        <View className="flex-row flex-wrap gap-3">
          <View className="min-w-[45%] flex-1 rounded-lg bg-blue-50 p-3">
            <Text className="text-gray-600 text-xs">Total de Leads</Text>
            <Text className="mt-1 font-bold text-2xl text-blue-600">{leads.length}</Text>
          </View>
          <View className="min-w-[45%] flex-1 rounded-lg bg-green-50 p-3">
            <Text className="text-gray-600 text-xs">Valor Total</Text>
            <Text className="mt-1 font-bold text-2xl text-green-600">
              $
              {(
                totals.awareness +
                totals.interest +
                totals.decision +
                totals.action
              ).toLocaleString()}
            </Text>
          </View>
          <View className="min-w-[45%] flex-1 rounded-lg bg-orange-50 p-3">
            <Text className="text-gray-600 text-xs">Ticket Médio</Text>
            <Text className="mt-1 font-bold text-2xl text-orange-600">
              $
              {leads.length > 0
                ? Math.round(
                    (totals.awareness + totals.interest + totals.decision + totals.action) /
                      leads.length,
                  ).toLocaleString()
                : 0}
            </Text>
          </View>
          <View className="min-w-[45%] flex-1 rounded-lg bg-red-50 p-3">
            <Text className="text-gray-600 text-xs">Taxa Fechamento</Text>
            <Text className="mt-1 font-bold text-2xl text-red-600">
              {leads.length > 0
                ? ((leadsByStage.action.length / leads.length) * 100).toFixed(1)
                : 0}
              %
            </Text>
          </View>
        </View>
      </View>

      {/* Modal for stage details */}
      <Modal
        visible={selectedStage !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedStage(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-center bg-black/50 px-4 pb-4">
            <TouchableOpacity
              className="absolute bottom-0 left-0 right-0 top-0"
              activeOpacity={1}
              onPress={() => setSelectedStage(null)}
            />
            <View className="h-[75%] rounded-3xl bg-white">
              {/* Header */}
              <View className="flex-row items-center justify-between border-gray-200 border-b p-4">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name={stages.find((s) => s.id === selectedStage)?.icon || "funnel-outline"}
                    size={24}
                    color={stages.find((s) => s.id === selectedStage)?.color || "#FF5722"}
                  />
                  <Text className="font-bold text-gray-800 text-xl">
                    {stages.find((s) => s.id === selectedStage)?.title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedStage(null)}>
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1 p-4">
                {selectedStage && getStageLeads(selectedStage).length === 0 ? (
                  <View className="items-center py-8">
                    <Ionicons name="folder-open-outline" size={48} color="#D1D5DB" />
                    <Text className="mt-2 text-gray-400">Nenhum lead nesta etapa</Text>
                  </View>
                ) : (
                  <View className="gap-4">
                    {selectedStage &&
                      getStageLeads(selectedStage).map((lead) => (
                        <View
                          key={lead._id}
                          className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                        >
                          <View className="mb-3 flex-row items-start justify-between">
                            <View className="flex-1">
                              <Text className="font-semibold text-gray-800 text-lg">
                                {lead.name}
                              </Text>
                              {lead.company && (
                                <Text className="mt-1 text-gray-500 text-sm">{lead.company}</Text>
                              )}
                            </View>
                            <View className="rounded-full bg-green-100 px-3 py-1">
                              <Text className="font-semibold text-green-700 text-sm">
                                {lead.probability}%
                              </Text>
                            </View>
                          </View>

                          <View className="mb-3 gap-3">
                            <View className="flex-row items-center justify-between">
                              <Text className="text-gray-500 text-sm">Valor Potencial</Text>
                              <Text className="font-bold text-gray-800 text-lg">
                                ${lead.value.toLocaleString()}
                              </Text>
                            </View>
                            {lead.lastContact && (
                              <View className="flex-row items-center justify-between">
                                <Text className="text-gray-500 text-sm">Último Contato</Text>
                                <Text className="text-gray-600">{lead.lastContact}</Text>
                              </View>
                            )}
                          </View>

                          {/* Action Buttons */}
                          <View className="mb-3 flex-row gap-2">
                            <TouchableOpacity
                              onPress={() => handleEdit(lead)}
                              className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white py-3"
                            >
                              <Ionicons name="pencil" size={18} color="#3B82F6" />
                              <Text className="font-semibold text-blue-500">Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleDelete(lead._id)}
                              className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-red-500 bg-white py-3"
                            >
                              <Ionicons name="trash" size={18} color="#EF4444" />
                              <Text className="font-semibold text-red-500">Excluir</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Move Stage Buttons */}
                          <View className="gap-2">
                            <Text className="font-medium text-gray-700">Mover para:</Text>
                            <View className="flex-row flex-wrap gap-2">
                              {stages
                                .filter((s) => s.id !== lead.stage)
                                .map((stage) => (
                                  <TouchableOpacity
                                    key={stage.id}
                                    onPress={() =>
                                      handleMoveStage(lead._id, stage.id as Lead["stage"])
                                    }
                                    className="min-w-[47%] flex-1 flex-row items-center justify-center gap-1 rounded-lg border-2 bg-white py-2"
                                    style={{ borderColor: stage.color }}
                                  >
                                    <Ionicons name={stage.icon} size={16} color={stage.color} />
                                    <Text
                                      className="font-medium text-sm"
                                      style={{ color: stage.color }}
                                    >
                                      {stage.title}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add/Edit Lead Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsAddModalVisible(false);
          resetForm();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-center bg-black/50 px-4 pb-4">
            <TouchableOpacity
              className="absolute bottom-0 left-0 right-0 top-0"
              activeOpacity={1}
              onPress={() => {
                setIsAddModalVisible(false);
                resetForm();
              }}
            />
            <View className="h-[75%] rounded-3xl bg-white">
              {/* Header */}
              <View className="flex-row items-center justify-between border-gray-200 border-b p-4">
                <Text className="font-bold text-gray-800 text-xl">
                  {editingLead ? "Editar Lead" : "Novo Lead"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsAddModalVisible(false);
                    resetForm();
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1 p-4">
                {/* Name and Company */}
                <View className="mb-4 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 font-medium text-gray-700">Nome do Lead *</Text>
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white p-3"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      placeholder="Ex: João Silva"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 font-medium text-gray-700">Empresa</Text>
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white p-3"
                      value={formData.company}
                      onChangeText={(text) => setFormData({ ...formData, company: text })}
                      placeholder="Ex: Acme Corp"
                    />
                  </View>
                </View>

                {/* Value and Probability */}
                <View className="mb-4 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 font-medium text-gray-700">Valor Potencial ($) *</Text>
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white p-3"
                      value={formData.value}
                      onChangeText={(text) => setFormData({ ...formData, value: text })}
                      placeholder="Ex: 50000"
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 font-medium text-gray-700">Probabilidade (%) *</Text>
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white p-3"
                      value={formData.probability}
                      onChangeText={(text) => setFormData({ ...formData, probability: text })}
                      placeholder="Ex: 50"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Stage Selection */}
                <View className="mb-4">
                  <Text className="mb-2 font-medium text-gray-700">Etapa do Funil *</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {stages.map((stage) => (
                      <TouchableOpacity
                        key={stage.id}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            stage: stage.id as Lead["stage"],
                          })
                        }
                        className={`min-w-[47%] flex-1 rounded-lg border-2 bg-white py-3`}
                        style={{
                          borderColor: formData.stage === stage.id ? stage.color : "#E5E7EB",
                        }}
                      >
                        <View className="items-center gap-1">
                          <Ionicons
                            name={stage.icon}
                            size={24}
                            color={formData.stage === stage.id ? stage.color : "#6B7280"}
                          />
                          <Text
                            className={`text-center font-medium text-sm ${
                              formData.stage === stage.id ? "text-gray-800" : "text-gray-600"
                            }`}
                          >
                            {stage.title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Info about selected stage */}
                {formData.stage && (
                  <View className="mb-4 rounded-lg bg-blue-50 p-3">
                    <Text className="font-medium text-blue-800 text-sm">
                      💡 {stages.find((s) => s.id === formData.stage)?.description}
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Action Buttons */}
              <View className="flex-row gap-3 border-gray-200 border-t p-4">
                <TouchableOpacity
                  onPress={() => {
                    setIsAddModalVisible(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-lg border border-gray-300 py-3"
                >
                  <Text className="text-center font-medium text-gray-700">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  className="flex-1 rounded-lg bg-orange-500 py-3"
                >
                  <Text className="text-center font-semibold text-white">
                    {editingLead ? "Salvar Alterações" : "Adicionar Lead"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
