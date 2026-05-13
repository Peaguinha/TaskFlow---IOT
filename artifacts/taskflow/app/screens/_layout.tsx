import { Stack } from "expo-router";
import { screenOptions } from "../navigation/AppNavigator";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Entrar" }} />
      <Stack.Screen name="register" options={{ title: "Criar Conta" }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="create-task" options={{ title: "Nova Tarefa" }} />
      <Stack.Screen name="task-details" options={{ title: "Detalhes da Tarefa" }} />
    </Stack>
  );
}
