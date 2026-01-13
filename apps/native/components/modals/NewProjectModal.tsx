import { Ionicons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useMutation } from "convex/react";
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

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ProjectStatus = "planning" | "in-progress" | "completed";
type ProjectPriority = "low" | "medium" | "high" | "urgent";

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProject = useMutation(api.projects.createProject);

  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    status: "planning" as ProjectStatus,
    priority: "medium" as ProjectPriority,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    progress: 0,
    budgetTotal: "",
    budgetSpent: "",
    tags: "",
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.client || !formData.description) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      await createProject({
        name: formData.name,
        client: formData.client,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        startDate: new Date(formData.startDate).getTime(),
        endDate: formData.endDate ? new Date(formData.endDate).getTime() : new Date().getTime(),
        progress: formData.progress,
        budget: {
          total: parseFloat(formData.budgetTotal) || 0,
          spent: parseFloat(formData.budgetSpent) || 0,
          remaining:
            (parseFloat(formData.budgetTotal) || 0) - (parseFloat(formData.budgetSpent) || 0),
        },
        teamIds: [],
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      Alert.alert("Sucesso", "Projeto criado com sucesso!");

      // Reset form
      setFormData({
        name: "",
        client: "",
        description: "",
        status: "planning",
        priority: "medium",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        progress: 0,
        budgetTotal: "",
        budgetSpent: "",
        tags: "",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
      Alert.alert("Erro", "Falha ao criar projeto. Tente novamente.");
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
              <Text className="font-bold text-xl text-gray-800">Criar Novo Projeto</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {/* Name and Client */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="mb-2 font-medium text-gray-700">Nome do Projeto *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="Nome do projeto"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-2 font-medium text-gray-700">Cliente *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="Nome do cliente"
                    value={formData.client}
                    onChangeText={(text) => setFormData({ ...formData, client: text })}
                  />
                </View>
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Descrição *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white h-24"
                  placeholder="Descrição do projeto"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>

              {/* Status and Priority */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="mb-2 font-medium text-gray-700">Status</Text>
                  <View className="border border-gray-300 rounded-lg">
                    <ScrollView>
                      {(["planning", "in-progress", "completed"] as ProjectStatus[]).map(
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
                              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                            </Text>
                          </TouchableOpacity>
                        ),
                      )}
                    </ScrollView>
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="mb-2 font-medium text-gray-700">Prioridade</Text>
                  <View className="border border-gray-300 rounded-lg">
                    <ScrollView>
                      {(["low", "medium", "high", "urgent"] as ProjectPriority[]).map(
                        (priority) => (
                          <TouchableOpacity
                            key={priority}
                            onPress={() => setFormData({ ...formData, priority })}
                            className={`p-3 border-b border-gray-200 ${
                              formData.priority === priority ? "bg-orange-50" : "bg-white"
                            }`}
                          >
                            <Text
                              className={
                                formData.priority === priority
                                  ? "font-semibold text-orange-600"
                                  : "text-gray-700"
                              }
                            >
                              {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ),
                      )}
                    </ScrollView>
                  </View>
                </View>
              </View>

              {/* Dates */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="mb-2 font-medium text-gray-700">Data de Início *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="YYYY-MM-DD"
                    value={formData.startDate}
                    onChangeText={(text) => setFormData({ ...formData, startDate: text })}
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-2 font-medium text-gray-700">Data de Término</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="YYYY-MM-DD"
                    value={formData.endDate}
                    onChangeText={(text) => setFormData({ ...formData, endDate: text })}
                  />
                </View>
              </View>

              {/* Budget */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="mb-2 font-medium text-gray-700">Orçamento Total</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={formData.budgetTotal}
                    onChangeText={(text) => setFormData({ ...formData, budgetTotal: text })}
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-2 font-medium text-gray-700">Gasto</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={formData.budgetSpent}
                    onChangeText={(text) => setFormData({ ...formData, budgetSpent: text })}
                  />
                </View>
              </View>

              {/* Progress */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">
                  Progresso: {formData.progress}%
                </Text>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() =>
                      setFormData({
                        ...formData,
                        progress: Math.max(0, formData.progress - 5),
                      })
                    }
                    className="w-10 h-10 items-center justify-center rounded-lg bg-gray-200"
                  >
                    <Text className="font-bold text-gray-700">-</Text>
                  </TouchableOpacity>
                  <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${formData.progress}%` }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setFormData({
                        ...formData,
                        progress: Math.min(100, formData.progress + 5),
                      })
                    }
                    className="w-10 h-10 items-center justify-center rounded-lg bg-gray-200"
                  >
                    <Text className="font-bold text-gray-700">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tags */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Tags (separadas por vírgula)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="design, development, urgent"
                  value={formData.tags}
                  onChangeText={(text) => setFormData({ ...formData, tags: text })}
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
                  <Text className="text-center font-semibold text-white">Criar Projeto</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
