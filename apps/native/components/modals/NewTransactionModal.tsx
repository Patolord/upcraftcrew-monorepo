import { Ionicons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
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

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTransaction = useMutation(api.finance.createTransaction);
  const projects = useQuery(api.projects.getProjects);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "income" as "income" | "expense",
    category: "",
    status: "pending" as "pending" | "completed" | "failed",
    date: new Date().toISOString().split("T")[0],
    clientId: "",
    projectId: "",
  });

  const handleSubmit = async () => {
    if (!formData.description || !formData.amount || !formData.category) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      Alert.alert("Erro", "Por favor, insira um valor válido");
      return;
    }

    setIsSubmitting(true);

    try {
      await createTransaction({
        description: formData.description,
        amount,
        type: formData.type,
        category: formData.category,
        status: formData.status,
        date: new Date(formData.date).getTime(),
        clientId: formData.clientId || undefined,
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
      });

      Alert.alert("Sucesso", "Transação criada com sucesso!");

      // Reset form
      setFormData({
        description: "",
        amount: "",
        type: "income",
        category: "",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        clientId: "",
        projectId: "",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create transaction:", error);
      Alert.alert("Erro", "Falha ao criar transação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const incomeCategories = [
    "Project Payment",
    "Consulting",
    "Retainer",
    "Licensing",
    "Investment",
    "Other Income",
  ];

  const expenseCategories = [
    "Salaries",
    "Software & Tools",
    "Marketing",
    "Office Rent",
    "Equipment",
    "Travel",
    "Training",
    "Other Expense",
  ];

  const categories = formData.type === "income" ? incomeCategories : expenseCategories;

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
              <Text className="font-bold text-xl text-gray-800">Nova Transação</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {/* Type */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Tipo *</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, type: "income" })}
                    className={`flex-1 rounded-lg py-3 ${
                      formData.type === "income" ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        formData.type === "income" ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Receita
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, type: "expense" })}
                    className={`flex-1 rounded-lg py-3 ${
                      formData.type === "expense" ? "bg-red-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        formData.type === "expense" ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Despesa
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Descrição *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="Descrição da transação"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>

              {/* Amount */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Valor *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                />
              </View>

              {/* Category */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Categoria *</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        onPress={() => setFormData({ ...formData, category })}
                        className={`p-3 border-b border-gray-200 ${
                          formData.category === category ? "bg-orange-50" : "bg-white"
                        }`}
                      >
                        <Text
                          className={
                            formData.category === category
                              ? "font-semibold text-orange-600"
                              : "text-gray-700"
                          }
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Status */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Status</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView>
                    {(["pending", "completed", "failed"] as const).map((status) => (
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
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Date */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Data *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="YYYY-MM-DD"
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                />
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
                  <Text className="text-center font-semibold text-white">Criar Transação</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
