import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRoute, RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../components/Button";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import type { RootStackParamList } from "../navigation/navigationRef";
import { navigate } from "../navigation/navigationRef";
import taskService from "../services/taskService";
import theme from "../styles/theme";

type Status = "pending" | "in_progress" | "done";
type Priority = "low" | "medium" | "high";

interface StatusTransition {
  next: Status;
  label: string;
  color: string;
}

const STATUS_TRANSITIONS: Record<Status, StatusTransition> = {
  pending: {
    next: "in_progress",
    label: "Iniciar Tarefa",
    color: theme.colors.primary,
  },
  in_progress: {
    next: "done",
    label: "Marcar como Concluída",
    color: theme.colors.success,
  },
  done: {
    next: "pending",
    label: "Reabrir Tarefa",
    color: theme.colors.warning,
  },
};

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

interface InfoRow {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string;
  valueColor: string;
}

export default function TaskDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "TaskDetails">>();
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 32 : insets.bottom;

  const [task, setTask] = useState(() => taskService.getById(id ?? ""));

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
  const transition = STATUS_TRANSITIONS[taskStatus];
  const pc = PRIORITY_CONFIG[taskPriority];

  const handleStatusChange = () => {
    const updated = taskService.updateStatus(task.id, transition.next);
    if (updated) {
      setTask({ ...updated });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const infoRows: InfoRow[] = [
    {
      icon: "flag",
      label: "Prioridade",
      value: pc.label,
      valueColor: pc.color,
    },
    {
      icon: "tag",
      label: "Categoria",
      value: task.category || "—",
      valueColor: theme.colors.text,
    },
    {
      icon: "calendar",
      label: "Vencimento",
      value: task.dueDate || "Sem data",
      valueColor: theme.colors.text,
    },
    {
      icon: "clock",
      label: "Criado em",
      value: task.createdAt || "—",
      valueColor: theme.colors.textSecondary,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          { paddingBottom: bottomPad + 120 },
          Platform.OS === "web" ? { maxWidth: 720, alignSelf: "center", width: "100%" } : {},
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.badgesRow}>
            <StatusBadge value={taskStatus} type="status" />
            <StatusBadge value={taskPriority} type="priority" />
          </View>
          <Text style={styles.title}>{task.title}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descrição</Text>
          <Text style={styles.description}>
            {task.description || "Sem descrição adicionada."}
          </Text>
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
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: bottomPad + 12 }]}>
        <Button
          title={transition.label}
          onPress={handleStatusChange}
          style={{ backgroundColor: transition.color }}
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
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 30,
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
  description: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 24,
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
