import { router } from "expo-router";

export const Routes = {
  WELCOME: "/screens/welcome",
  LOGIN: "/screens/login",
  REGISTER: "/screens/register",
  DASHBOARD: "/screens/dashboard",
  CREATE_TASK: "/screens/create-task",
  TASK_DETAILS: (id) => `/screens/task-details?id=${id}`,
};

export const navigate = {
  toWelcome: () => router.replace(Routes.WELCOME),
  toLogin: () => router.push(Routes.LOGIN),
  toRegister: () => router.push(Routes.REGISTER),
  toDashboard: () => router.replace(Routes.DASHBOARD),
  toCreateTask: () => router.push(Routes.CREATE_TASK),
  toTaskDetails: (id) => router.push(Routes.TASK_DETAILS(id)),
  back: () => router.back(),
};

export const screenOptions = {
  headerStyle: {
    backgroundColor: "#FFFFFF",
  },
  headerTintColor: "#4F46E5",
  headerTitleStyle: {
    fontWeight: "600",
    color: "#1E1B4B",
    fontSize: 17,
  },
  headerShadowVisible: false,
  headerBackTitle: "Voltar",
};

export default navigate;
