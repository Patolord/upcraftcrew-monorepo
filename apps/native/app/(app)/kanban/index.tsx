import { Ionicons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NewTaskModal } from "@/components/modals/NewTaskModal";

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

export default function KanbanPage() {
  const tasks = useQuery(api.tasks.getTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === "" ||
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [tasks, searchQuery]);

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, typeof filteredTasks> = {
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
      blocked: [],
    };

    filteredTasks.forEach((task) => {
      if (task.status && groups[task.status as TaskStatus]) {
        groups[task.status as TaskStatus].push(task);
      }
    });

    return groups;
  }, [filteredTasks]);

  if (tasks === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5722" />
        <Text className="mt-4 text-gray-600">Loading kanban...</Text>
      </View>
    );
  }

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: "todo", title: "To Do", color: "bg-gray-100" },
    { id: "in-progress", title: "In Progress", color: "bg-orange-100" },
    { id: "review", title: "Review", color: "bg-yellow-100" },
    { id: "done", title: "Done", color: "bg-green-100" },
    { id: "blocked", title: "Blocked", color: "bg-red-100" },
  ];

  return (
    <View className="flex-1 pt-16 ">
      {/* Header */}
      <View className="border-gray-200 border-b bg-white p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="font-bold text-3xl text-orange-500">Kanban</Text>
          <TouchableOpacity
            onPress={() => setIsNewTaskModalOpen(true)}
            className="rounded-lg bg-orange-500 px-4 py-2"
          >
            <Text className="font-semibold text-white">+ New Task</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center rounded-lg bg-gray-50 p-3">
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            className="ml-2 flex-1 text-gray-800"
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Kanban Board */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
        <View className="flex-row gap-4 p-4">
          {columns.map((column) => {
            const columnTasks = groupedTasks[column.id] || [];
            return (
              <View key={column.id} className="w-80">
                {/* Column Header */}
                <View className={`${column.color} rounded-t-lg p-3`}>
                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold text-gray-800">{column.title}</Text>
                    <View className="rounded bg-white px-2 py-1">
                      <Text className="font-medium text-gray-700 text-xs">
                        {columnTasks.length}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Column Content */}
                <ScrollView
                  className="max-h-screen rounded-b-lg bg-white p-3"
                  showsVerticalScrollIndicator={false}
                >
                  <View className="space-y-3">
                    {columnTasks.map((task) => (
                      <View
                        key={task._id}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                      >
                        {/* Task Title */}
                        <Text className="mb-2 font-semibold text-gray-800">{task.title}</Text>

                        {/* Task Description */}
                        {task.description && (
                          <Text className="mb-3 text-gray-600 text-sm" numberOfLines={3}>
                            {task.description}
                          </Text>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <View className="mb-3 flex-row flex-wrap gap-2">
                            {task.tags.map((tag, idx) => (
                              <View key={idx} className="rounded bg-orange-100 px-2 py-1">
                                <Text className="text-orange-700 text-xs">{tag}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* Task Meta */}
                        {task.assignedUser && (
                          <View className="mt-2 flex-row items-center">
                            <View className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-orange-100">
                              <Text className="font-semibold text-orange-500 text-xs">
                                {task.assignedUser.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </Text>
                            </View>
                            <Text className="text-gray-600 text-xs">{task.assignedUser.name}</Text>
                          </View>
                        )}

                        {task.dueDate && (
                          <View className="mt-2 flex-row items-center">
                            <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                            <Text className="ml-1 text-gray-600 text-xs">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}

                    {columnTasks.length === 0 && (
                      <View className="items-center py-8">
                        <Ionicons name="folder-open-outline" size={32} color="#d1d5db" />
                        <Text className="mt-2 text-gray-400 text-sm">No tasks</Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <NewTaskModal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)} />
    </View>
  );
}
