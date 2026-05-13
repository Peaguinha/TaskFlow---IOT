import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#4F46E5",
        headerTitleStyle: {
          fontWeight: "600" as const,
          color: "#1E1B4B",
          fontSize: 17,
        },
        headerShadowVisible: false,
        headerBackTitle: "Voltar",
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Entrar" }} />
      <Stack.Screen name="register" options={{ title: "Criar Conta" }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="create-task" options={{ title: "Nova Tarefa" }} />
      <Stack.Screen name="task-details" options={{ title: "Detalhes da Tarefa" }} />
    </Stack>
  );
}
