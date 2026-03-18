import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Tabs } from "expo-router/tabs";
import { ActivityIndicator, View } from "react-native";
import { BottomBar } from "@/components/bottom-bar";

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      tabBar={(_props) => <BottomBar />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="dashboard"
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="projects" options={{ title: "Projetos" }} />
      <Tabs.Screen name="clients" options={{ title: "Clientes" }} />
      <Tabs.Screen name="team" options={{ title: "Equipe" }} />
      <Tabs.Screen name="schedule" options={{ title: "Agenda" }} />
      <Tabs.Screen name="kanban" options={{ title: "Kanban" }} />
      <Tabs.Screen name="finance" options={{ title: "Finanças" }} />
      <Tabs.Screen name="budgets" options={{ title: "Orçamentos" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
      <Tabs.Screen name="assistant" options={{ title: "Assistente" }} />
    </Tabs>
  );
}
