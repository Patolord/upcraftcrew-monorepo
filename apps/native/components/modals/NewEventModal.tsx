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

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedDate?: Date;
}

export function NewEventModal({ isOpen, onClose, preSelectedDate }: NewEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createEvent = useMutation(api.schedule.createEvent);
  const projects = useQuery(api.projects.getProjects);
  const teamMembers = useQuery(api.team.getTeamMembers);

  const defaultDate = preSelectedDate
    ? preSelectedDate.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "meeting" as string,
    startTime: defaultDate,
    startHour: "09",
    startMinute: "00",
    endTime: defaultDate,
    endHour: "10",
    endMinute: "00",
    location: "",
    projectId: "",
    priority: "medium" as "low" | "medium" | "high",
    attendeeIds: [] as string[],
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      Alert.alert("Erro", "Por favor, preencha título e descrição");
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateTime = new Date(
        `${formData.startTime}T${formData.startHour}:${formData.startMinute}:00`,
      ).getTime();
      const endDateTime = new Date(
        `${formData.endTime}T${formData.endHour}:${formData.endMinute}:00`,
      ).getTime();

      await createEvent({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        startTime: startDateTime,
        endTime: endDateTime,
        location: formData.location || undefined,
        attendeeIds: formData.attendeeIds.map((id) => id as Id<"users">),
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
        priority: formData.priority,
      });

      Alert.alert("Sucesso", "Evento criado com sucesso!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "meeting",
        startTime: defaultDate,
        startHour: "09",
        startMinute: "00",
        endTime: defaultDate,
        endHour: "10",
        endMinute: "00",
        location: "",
        projectId: "",
        priority: "medium",
        attendeeIds: [],
      });

      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
      Alert.alert("Erro", "Falha ao criar evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const eventTypes = ["meeting", "deadline", "task", "reminder", "milestone"];

  const toggleAttendee = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      attendeeIds: prev.attendeeIds.includes(memberId)
        ? prev.attendeeIds.filter((id) => id !== memberId)
        : [...prev.attendeeIds, memberId],
    }));
  };

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
              <Text className="font-bold text-xl text-gray-800">Novo Evento</Text>
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
                  placeholder="Título do evento"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Descrição *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white h-24"
                  placeholder="Descrição do evento"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>

              {/* Type */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Tipo</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row">
                      {eventTypes.map((type) => (
                        <TouchableOpacity
                          key={type}
                          onPress={() => setFormData({ ...formData, type })}
                          className={`px-4 py-2 mx-1 rounded-lg ${
                            formData.type === type ? "bg-orange-500" : "bg-gray-200"
                          }`}
                        >
                          <Text
                            className={
                              formData.type === type ? "text-white font-semibold" : "text-gray-700"
                            }
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>

              {/* Start Date and Time */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Data e Hora de Início</Text>
                <View className="flex-row gap-2">
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="YYYY-MM-DD"
                    value={formData.startTime}
                    onChangeText={(text) => setFormData({ ...formData, startTime: text })}
                  />
                  <TextInput
                    className="w-20 border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="HH"
                    value={formData.startHour}
                    onChangeText={(text) => setFormData({ ...formData, startHour: text })}
                  />
                  <Text className="self-center">:</Text>
                  <TextInput
                    className="w-20 border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="MM"
                    value={formData.startMinute}
                    onChangeText={(text) => setFormData({ ...formData, startMinute: text })}
                  />
                </View>
              </View>

              {/* End Date and Time */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Data e Hora de Término</Text>
                <View className="flex-row gap-2">
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="YYYY-MM-DD"
                    value={formData.endTime}
                    onChangeText={(text) => setFormData({ ...formData, endTime: text })}
                  />
                  <TextInput
                    className="w-20 border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="HH"
                    value={formData.endHour}
                    onChangeText={(text) => setFormData({ ...formData, endHour: text })}
                  />
                  <Text className="self-center">:</Text>
                  <TextInput
                    className="w-20 border border-gray-300 rounded-lg p-3 bg-white"
                    placeholder="MM"
                    value={formData.endMinute}
                    onChangeText={(text) => setFormData({ ...formData, endMinute: text })}
                  />
                </View>
              </View>

              {/* Location */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Localização (opcional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  placeholder="Localização do evento"
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                />
              </View>

              {/* Priority */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Prioridade</Text>
                <View className="flex-row gap-2">
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      onPress={() => setFormData({ ...formData, priority })}
                      className={`flex-1 rounded-lg py-2 ${
                        formData.priority === priority ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          formData.priority === priority ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
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

              {/* Attendees */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700">Participantes (opcional)</Text>
                <View className="border border-gray-300 rounded-lg">
                  <ScrollView>
                    {teamMembers?.map((member) => {
                      const isSelected = formData.attendeeIds.includes(member._id);
                      return (
                        <TouchableOpacity
                          key={member._id}
                          onPress={() => toggleAttendee(member._id)}
                          className={`p-3 border-b border-gray-200 flex-row items-center ${
                            isSelected ? "bg-orange-50" : "bg-white"
                          }`}
                        >
                          <View
                            className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                              isSelected ? "bg-orange-500 border-orange-500" : "border-gray-300"
                            }`}
                          >
                            {isSelected && <Ionicons name="checkmark" size={12} color="white" />}
                          </View>
                          <Text
                            className={
                              isSelected ? "font-semibold text-orange-600" : "text-gray-700"
                            }
                          >
                            {member.firstName} {member.lastName}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
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
                  <Text className="text-center font-semibold text-white">Criar Evento</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
