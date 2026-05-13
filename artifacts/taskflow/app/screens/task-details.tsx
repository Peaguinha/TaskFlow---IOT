import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatusBadge from "../components/StatusBadge";
import { navigate } from "../navigation/AppNavigator";
import taskService from "../services/taskService";
import theme from "../styles/theme";

type Status = "pending" | "in_progress" | "done";

const STATUS_TRANSITIONS: Record<Status, { next: Status; label: string; icon: string; color: string }> = {
  pending: {
    next: "in_progress",
    label: "Iniciar Tarefa",
    icon: "play",
    color: theme.colors.primary,
  },
  in_progress: {
    next: "done",
    label: "Marcar como Concluída",
    icon: "check",
    color: theme.colors.success,
  },
  done: {
    next: "pending",
    label: "Reabrir Tarefa",
    icon: "refresh-cw",
    color: theme.colors.warning,
  },
};

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [task, setTask] = useState(() => taskService.getById(id ?? ""));

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Feather name="alert-circle" size={48} color={theme.colors.textMuted} />
        <Text style={styles.notFoundTitle}>Tarefa não encontrada</Text>
        <TouchableOpacity onPress={navigate.toDashboard} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Voltar ao Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const transition = STATUS_TRANSITIONS[task.status as Status];

  const handleStatusChange = () => {
    const updated = taskService.updateStatus(task.id, transition.next);
    if (updated) {
      setTask({ ...updated });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const priorityConfig = {
    low: { label: "Baixa", color: theme.colors.priorityLow },
    medium: { label: "Média", color: theme.colors.priorityMedium },
    high: { label: "Alta", color: theme.colors.priorityHigh },
  } as Record<string, { label: string; color: string }>;

  const pc = priorityConfig[task.priority] ?? { label: "—", color: theme.colors.textMuted };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.badgesRow}>
            <StatusBadge value={task.status as any} type="status" />
            <StatusBadge value={task.priority as any} type="priority" />
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
            {[
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
            ].map((row, i, arr) => (
              <View
                key={row.label}
                style={[styles.infoRow, i < arr.length - 1 && styles.infoRowBorder]}
              >
                <View style={styles.infoLeft}>
                  <Feather name={row.icon as any} size={16} color={theme.colors.textMuted} />
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

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: bottomPad + 12 },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: transition.color }]}
          onPress={handleStatusChange}
          activeOpacity={0.85}
        >
          <Feather name={transition.icon as any} size={20} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>{transition.label}</Text>
        </TouchableOpacity>
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  badgesRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold as "700",
    color: "#FFFFFF",
    lineHeight: 32,
  },
  card: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    ...theme.shadow.sm,
  },
  cardTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold as "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: theme.fontSize.md,
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
    gap: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold as "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.lg,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as "700",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  notFoundTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.semibold as "600",
  },
  backBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.sm,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: theme.fontWeight.semibold as "600",
    fontSize: theme.fontSize.md,
  },
});
