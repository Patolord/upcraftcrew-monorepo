import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MonthNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function MonthNavigator({ selectedDate, onDateChange }: MonthNavigatorProps) {
  const monthName = selectedDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <Card className="rounded-xl bg-card shadow-sm">
      <CardContent className="p-4">
        {/* Navigation */}
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={goToPreviousMonth} className="p-2" activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#ff8e29" />
          </TouchableOpacity>

          <Text className="text-base font-semibold text-foreground capitalize">{monthName}</Text>

          <TouchableOpacity onPress={goToNextMonth} className="p-2" activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={24} color="#ff8e29" />
          </TouchableOpacity>
        </View>

        {/* Today Button */}
        <Button variant="default" onPress={goToToday} className="bg-brand w-full">
          <Text className="text-white font-medium text-sm">Hoje</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
