import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRoute, RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../components/Button";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { useTasks } from "../context/TaskContext";
import type { RootStackParamList } from "../navigation/navigationRef";
import { navigate } from "../navigation/navigationRef";
import theme from "../styles/theme";

type Status = "pending" | "in_progress" | "done";
type Priority = "low" | "medium" | "high";

const STATUS_OPTIONS: { value: Status; label: string; icon: React.ComponentProps<typeof Feather>["name"]; color: string }[] = [
  { value: "pending", label: "Pendente", icon: "clock", color: theme.colors.statusPending },
  { value: "in_progress", label: "Em Andamento", icon: "loader", color: theme.colors.statusInProgress },
  { value: "done", label: "Concluída", icon: "check-circle", color: theme.colors.statusDone },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: "Baixa", color: theme.colors.priorityLow },
  medium: { label: "Média", color: theme.colors.priorityMedium },
  high: { label: "Alta", color: theme.colors.priorityHigh },
};

function isStatus(value: string): value is Status {
  return value === "pending" || value === "in_progress" || value === "done";
}

function isPriority(value: string): value is Priority {
  return value === "low" || value === "medium" || value === "high";
}

export default function TaskDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "TaskDetails">>();
  const { id } = route.params;
  const { getById, updateStatus, deleteTask } = useTasks();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 32 : insets.bottom;

  const [task, setTask] = useState(() => getById(id ?? ""));

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Feather name="alert-circle" size={48} color={theme.colors.textMuted} />
        <Text style={styles.notFoundTitle}>Tarefa não encontrada</Text>
        <View style={styles.notFoundBtnWrap}>
          <Button title="Voltar ao Dashboard" onPress={navigate.toDashboard} />
        </View>
      </View>
    );
  }

  const taskStatus: Status = isStatus(task.status) ? task.status : "pending";
  const taskPriority: Priority = isPriority(task.priority) ? task.priority : "medium";
  const pc = PRIORITY_CONFIG[taskPriority];

  const handleStatusChange = (newStatus: Status) => {
    const updated = updateStatus(task.id, newStatus);
    if (updated) {
      setTask({ ...updated });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    navigate.toDashboard();
  };

  const infoRows = [
    { icon: "flag" as const, label: "Prioridade", value: pc.label, valueColor: pc.color },
    { icon: "tag" as const, label: "Categoria", value: task.category || "—", valueColor: theme.colors.text },
    { icon: "calendar" as const, label: "Vencimento", value: task.dueDate || "Sem data", valueColor: theme.colors.text },
    { icon: "clock" as const, label: "Criado em", value: task.createdAt || "—", valueColor: theme.colors.textSecondary },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          { paddingBottom: bottomPad + 180 },
          Platform.OS === "web" ? { maxWidth: 720, alignSelf: "center", width: "100%" } : {},
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Header
            title={task.title}
            subtitle={task.description || "Sem descrição"}
            onBack={navigate.back}
          />
          <View style={styles.badgesRow}>
            <StatusBadge value={taskStatus} type="status" />
            <StatusBadge value={taskPriority} type="priority" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações</Text>
          <View style={styles.infoList}>
            {infoRows.map((row, i) => (
              <View
                key={row.label}
                style={[
                  styles.infoRow,
                  i < infoRows.length - 1 && styles.infoRowBorder,
                ]}
              >
                <View style={styles.infoLeft}>
                  <Feather
                    name={row.icon}
                    size={16}
                    color={theme.colors.textMuted}
                  />
                  <Text style={styles.infoLabel}>{row.label}</Text>
                </View>
                <Text style={[styles.infoValue, { color: row.valueColor }]}>
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alterar Status</Text>
          <View style={styles.statusButtons}>
            {STATUS_OPTIONS.map((s) => {
              const isActive = taskStatus === s.value;
              return (
                <TouchableOpacity
                  key={s.value}
                  style={[
                    styles.statusBtn,
                    isActive && { backgroundColor: s.color, borderColor: s.color },
                  ]}
                  onPress={() => handleStatusChange(s.value)}
                  activeOpacity={0.75}
                >
                  <Feather
                    name={s.icon}
                    size={16}
                    color={isActive ? "#FFFFFF" : s.color}
                  />
                  <Text
                    style={[
                      styles.statusBtnText,
                      isActive && { color: "#FFFFFF" },
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: bottomPad + 12 }]}>
        <Button
          title="Excluir Tarefa"
          variant="danger"
          onPress={handleDelete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroCard: {
    backgroundColor: theme.colors.primary,
    padding: 24,
    paddingBottom: 32,
    gap: 12,
    ...(Platform.OS === "web" ? { maxWidth: 720, alignSelf: "center", width: "100%" } : {}),
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    ...theme.shadow.sm,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoList: {
    gap: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoLabel: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  statusButtons: {
    flexDirection: "row",
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...(Platform.OS === "web" ? { maxWidth: 720, alignSelf: "center" } : {}),
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 17,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  notFoundBtnWrap: {
    marginTop: 8,
    minWidth: 220,
  },
});
