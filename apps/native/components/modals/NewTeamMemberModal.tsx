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

interface NewTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTeamMemberModal({ isOpen, onClose }: NewTeamMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTeamMember = useMutation(api.team.createTeamMember);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "member" as "admin" | "member" | "viewer",
    department: "",
    status: "online" as "online" | "offline" | "away" | "busy",
    skills: "",
    avatar: "",
  });

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      await createTeamMember({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
      });

      Alert.alert("Sucesso", "Membro da equipe adicionado com sucesso!");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "member",
        department: "",
        status: "online",
        skills: "",
        avatar: "",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create team member:", error);
      Alert.alert("Erro", "Falha ao adicionar membro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const departments = [
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "Product",
    "HR",
    "Finance",
    "Operations",
  ];

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-center px-4 pb-4">
          <TouchableOpacity className="absolute top-0 left-0 right-0 bottom-0" onPress={onClose} />
          <View className="bg-white rounded-3xl h-[75%]">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="font-bold text-xl text-gray-800">Adicionar Membro</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {/* Name */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Nome Completo *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="Nome completo"
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                />
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Email *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="email@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
              </View>

              {/* Role */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Nível de Permissão *</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView>
                    {(["viewer", "member", "admin"] as const).map((role) => (
                      <TouchableOpacity
                        key={role}
                        onPress={() => setFormData({ ...formData, role })}
                        className={`p-3 border-b border-gray-200 ${
                          formData.role === role ? "bg-orange-50" : "bg-white"
                        }`}
                      >
                        <Text
                          className={
                            formData.role === role
                              ? "font-semibold text-orange-600"
                              : "text-gray-700"
                          }
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Department */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Departamento *</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView>
                    {departments.map((dept) => (
                      <TouchableOpacity
                        key={dept}
                        onPress={() => setFormData({ ...formData, department: dept })}
                        className={`p-3 border-b border-gray-200 ${
                          formData.department === dept ? "bg-orange-50" : "bg-white"
                        }`}
                      >
                        <Text
                          className={
                            formData.department === dept
                              ? "font-semibold text-orange-600"
                              : "text-gray-700"
                          }
                        >
                          {dept}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Status */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Status Inicial</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView>
                    {(["online", "offline", "away", "busy"] as const).map((status) => (
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

              {/* Skills */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">
                  Habilidades (separadas por vírgula)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="React, TypeScript, Node.js"
                  value={formData.skills}
                  onChangeText={(text) => setFormData({ ...formData, skills: text })}
                />
              </View>

              {/* Avatar URL */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">URL do Avatar (opcional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="https://exemplo.com/avatar.jpg"
                  keyboardType="url"
                  autoCapitalize="none"
                  value={formData.avatar}
                  onChangeText={(text) => setFormData({ ...formData, avatar: text })}
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
                  <Text className="text-center font-semibold text-white">Adicionar Membro</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
