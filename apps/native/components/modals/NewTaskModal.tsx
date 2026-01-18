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

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";
type TaskPriority = "low" | "medium" | "high" | "urgent";

export function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTask = useMutation(api.tasks.createTask);
  const projects = useQuery(api.projects.getProjects);
  const teamMembers = useQuery(api.team.getTeamMembers);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    assignedTo: "",
    projectId: "",
    dueDate: "",
    isPrivate: false,
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      Alert.alert("Erro", "Por favor, preencha título e descrição");
      return;
    }

    setIsSubmitting(true);

    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo ? (formData.assignedTo as Id<"users">) : undefined,
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
        isPrivate: formData.isPrivate,
      });

      Alert.alert("Sucesso", "Task criada com sucesso!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignedTo: "",
        projectId: "",
        dueDate: "",
        isPrivate: false,
      });

      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
      Alert.alert("Erro", "Falha ao criar task. Tente novamente.");
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
              <Text className="font-bold text-xl text-gray-800">Criar Nova Task</Text>
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
                  placeholder="Digite o título da task"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Descrição *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white h-24"
                  placeholder="Digite a descrição"
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
                      {(["todo", "in-progress", "review", "done", "blocked"] as TaskStatus[]).map(
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
                      {(["low", "medium", "high", "urgent"] as TaskPriority[]).map((priority) => (
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
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>

              {/* Assigned To */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Atribuído a (opcional)</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView>
                    <TouchableOpacity
                      onPress={() => setFormData({ ...formData, assignedTo: "" })}
                      className={`p-3 border-b border-gray-200 ${
                        formData.assignedTo === "" ? "bg-orange-50" : "bg-white"
                      }`}
                    >
                      <Text
                        className={
                          formData.assignedTo === ""
                            ? "font-semibold text-orange-600"
                            : "text-gray-700"
                        }
                      >
                        Ninguém
                      </Text>
                    </TouchableOpacity>
                    {teamMembers?.map((member) => (
                      <TouchableOpacity
                        key={member._id}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            assignedTo: member._id,
                          })
                        }
                        className={`p-3 border-b border-gray-200 ${
                          formData.assignedTo === member._id ? "bg-orange-50" : "bg-white"
                        }`}
                      >
                        <Text
                          className={
                            formData.assignedTo === member._id
                              ? "font-semibold text-orange-600"
                              : "text-gray-700"
                          }
                        >
                          {member.firstName} {member.lastName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
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

              {/* Due Date */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">
                  Data de Vencimento (opcional)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="YYYY-MM-DD"
                  value={formData.dueDate}
                  onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
                />
              </View>

              {/* Tags */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Tags (separadas por vírgula)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="frontend, bug, urgent"
                />
              </View>

              {/* Private Toggle */}
              <View className="mb-4 flex-row items-center">
                <TouchableOpacity
                  onPress={() =>
                    setFormData({
                      ...formData,
                      isPrivate: !formData.isPrivate,
                    })
                  }
                  className="flex-row items-center"
                >
                  <View
                    className={`w-6 h-6 rounded border-2 mr-2 items-center justify-center ${
                      formData.isPrivate ? "bg-orange-500 border-orange-500" : "border-gray-300"
                    }`}
                  >
                    {formData.isPrivate && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-gray-700">Task Privada</Text>
                </TouchableOpacity>
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
                  <Text className="text-center font-semibold text-white">Criar Task</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
