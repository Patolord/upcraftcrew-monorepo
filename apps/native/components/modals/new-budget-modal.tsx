import { Ionicons } from "@expo/vector-icons";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@upcraftcrew-os/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  ActivityIndicator,
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

interface NewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BudgetItem {
  description: string;
  quantity: string;
  unitPrice: string;
  total: number;
}

export function NewBudgetModal({ isOpen, onClose }: NewBudgetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBudget = useMutation(api.budgets.createBudget);
  const projects = useQuery(api.projects.getProjects);

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
    status: "draft" as "draft" | "sent" | "approved" | "rejected" | "expired",
    currency: "BRL",
    items: [] as BudgetItem[],
    validUntil: "",
    projectId: "",
    notes: "",
    budgetDate: "", // Data do orçamento (retroativa)
  });

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: "1", unitPrice: "0", total: 0 }],
    }));
  };

  const updateItem = (index: number, field: keyof BudgetItem, value: string) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      const item = { ...newItems[index] };

      if (field === "description") {
        item.description = value;
      } else if (field === "quantity") {
        item.quantity = value;
      } else if (field === "unitPrice") {
        item.unitPrice = value;
      }

      if (field === "quantity" || field === "unitPrice") {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unitPrice) || 0;
        item.total = qty * price;
      }

      newItems[index] = item;
      return { ...prev, items: newItems };
    });
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.client || !formData.description) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.items.length === 0) {
      Alert.alert("Erro", "Por favor, adicione pelo menos um item");
      return;
    }

    setIsSubmitting(true);

    try {
      const items = formData.items.map((item) => ({
        description: item.description,
        quantity: parseFloat(item.quantity) || 0,
        unitPrice: parseFloat(item.unitPrice) || 0,
        total: item.total,
      }));

      await createBudget({
        title: formData.title,
        client: formData.client,
        description: formData.description,
        status: formData.status,
        currency: formData.currency,
        items,
        validUntil: formData.validUntil
          ? (() => {
              // Parse DD/MM/YYYY format
              const parts = formData.validUntil.split("/");
              if (parts.length === 3) {
                const [day, month, year] = parts;
                return new Date(
                  parseInt(year, 10),
                  parseInt(month, 10) - 1,
                  parseInt(day, 10),
                ).getTime();
              }
              return Date.now() + 30 * 24 * 60 * 60 * 1000;
            })()
          : Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
        notes: formData.notes || undefined,
        budgetDate: formData.budgetDate
          ? (() => {
              // Parse DD/MM/YYYY format
              const parts = formData.budgetDate.split("/");
              if (parts.length === 3) {
                const [day, month, year] = parts;
                return new Date(
                  parseInt(year, 10),
                  parseInt(month, 10) - 1,
                  parseInt(day, 10),
                ).getTime();
              }
              return undefined;
            })()
          : undefined, // Data retroativa opcional
      });

      Alert.alert("Sucesso", "Orçamento criado com sucesso!");

      // Reset form
      setFormData({
        title: "",
        client: "",
        description: "",
        status: "draft",
        currency: "BRL",
        items: [],
        validUntil: "",
        projectId: "",
        notes: "",
        budgetDate: "",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create budget:", error);
      Alert.alert("Erro", "Falha ao criar orçamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-center px-4 pb-4">
          <TouchableOpacity
            className="absolute top-0 left-0 right-0 bottom-0"
            activeOpacity={1}
            onPress={onClose}
          />
          <View className="bg-white rounded-3xl h-[75%]">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="font-bold text-xl text-gray-800">Novo Orçamento</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {/* Title */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Título *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="Título do orçamento"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
              </View>

              {/* Client */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Cliente *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="Nome do cliente"
                  value={formData.client}
                  onChangeText={(text) => setFormData({ ...formData, client: text })}
                />
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Descrição *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white h-24"
                  placeholder="Descrição do orçamento"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>

              {/* Budget Date - Retroactive */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Data do Orçamento</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="DD/MM/AAAA (deixe vazio para data atual)"
                  value={formData.budgetDate}
                  onChangeText={(text) => {
                    // Auto-format as DD/MM/YYYY
                    let formatted = text.replace(/\D/g, "");
                    if (formatted.length > 2) {
                      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
                    }
                    if (formatted.length > 5) {
                      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5, 9)}`;
                    }
                    setFormData({ ...formData, budgetDate: formatted });
                  }}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Text className="mt-1 text-xs text-gray-500">
                  Use para registrar orçamentos retroativos e manter o histórico
                </Text>
              </View>

              {/* Status */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Status</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView>
                    {(["draft", "sent", "approved", "rejected", "expired"] as const).map(
                      (status) => (
                        <TouchableOpacity
                          key={status}
                          onPress={() => setFormData({ ...formData, status })}
                          className={`p-3 border-b border-gray-200 ${
                            formData.status === status ? "bg-orange-50" : "bg-white"
                          }`}
                        >
                          <Text
                            className={
                              formData.status === status
                                ? "font-semibold text-orange-600"
                                : "text-gray-700"
                            }
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </ScrollView>
                </View>
              </View>

              {/* Valid Until */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Válido até (opcional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="DD/MM/AAAA"
                  value={formData.validUntil}
                  onChangeText={(text) => {
                    // Auto-format as DD/MM/YYYY
                    let formatted = text.replace(/\D/g, "");
                    if (formatted.length > 2) {
                      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
                    }
                    if (formatted.length > 5) {
                      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5, 9)}`;
                    }
                    setFormData({ ...formData, validUntil: formatted });
                  }}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              {/* Items */}
              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-gray-700">Itens *</Text>
                  <TouchableOpacity
                    onPress={addItem}
                    className="rounded-lg bg-orange-500 px-3 py-1"
                  >
                    <Text className="text-white font-semibold">+ Adicionar</Text>
                  </TouchableOpacity>
                </View>
                {formData.items.map((item, index) => (
                  <View
                    key={`item-${index}-${item.description}`}
                    className="mb-3 p-3 border border-gray-300 rounded-lg"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-medium text-gray-700">Item {index + 1}</Text>
                      <TouchableOpacity onPress={() => removeItem(index)}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      className="mb-2 border border-gray-300 rounded-lg p-2 bg-white"
                      placeholder="Descrição"
                      value={item.description}
                      onChangeText={(text) => updateItem(index, "description", text)}
                    />
                    <View className="flex-row gap-2">
                      <TextInput
                        className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
                        placeholder="Quantidade"
                        keyboardType="numeric"
                        value={item.quantity}
                        onChangeText={(text) => updateItem(index, "quantity", text)}
                      />
                      <TextInput
                        className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
                        placeholder="Preço unitário"
                        keyboardType="numeric"
                        value={item.unitPrice}
                        onChangeText={(text) => updateItem(index, "unitPrice", text)}
                      />
                    </View>
                    <Text className="mt-2 text-right font-semibold text-orange-600">
                      Total: ${item.total.toFixed(2)}
                    </Text>
                  </View>
                ))}
                {formData.items.length === 0 && (
                  <Text className="text-gray-500 text-center py-4">Nenhum item adicionado</Text>
                )}
              </View>

              {/* Project */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Projeto (opcional)</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView>
                    <TouchableOpacity
                      onPress={() => setFormData({ ...formData, projectId: "" })}
                      className={`p-3 border-b border-gray-200 ${
                        formData.projectId === "" ? "bg-orange-50" : "bg-white"
                      }`}
                    >
                      <Text
                        className={
                          formData.projectId === ""
                            ? "font-semibold text-orange-600"
                            : "text-gray-700"
                        }
                      >
                        Nenhum
                      </Text>
                    </TouchableOpacity>
                    {projects?.map((project) => (
                      <TouchableOpacity
                        key={project._id}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            projectId: project._id,
                          })
                        }
                        className={`p-3 border-b border-gray-200 ${
                          formData.projectId === project._id ? "bg-orange-50" : "bg-white"
                        }`}
                      >
                        <Text
                          className={
                            formData.projectId === project._id
                              ? "font-semibold text-orange-600"
                              : "text-gray-700"
                          }
                        >
                          {project.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Notes */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Notas (opcional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white h-24"
                  placeholder="Notas adicionais"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                />
              </View>
            </ScrollView>

            {/* Actions */}
            <View className="flex-row gap-3 p-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-gray-300 py-3"
              >
                <Text className="text-center font-medium text-gray-700">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-orange-500 py-3"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center font-semibold text-white">Criar Orçamento</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
