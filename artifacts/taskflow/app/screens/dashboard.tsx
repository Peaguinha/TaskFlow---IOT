import { Feather } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import FilterTabs from "../components/FilterTabs";
import TaskCard from "../components/TaskCard";
import { navigate } from "../navigation/navigationRef";
import taskService from "../services/taskService";
import theme from "../styles/theme";

type TaskStatus = "pending" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt?: string;
  category?: string;
}

function toTask(raw: Record<string, string>): Task {
  const status: TaskStatus =
    raw.status === "in_progress" || raw.status === "done"
      ? raw.status
      : "pending";
  const priority: TaskPriority =
    raw.priority === "high" || raw.priority === "low"
      ? raw.priority
      : "medium";
  return {
    id: raw.id ?? "",
    title: raw.title ?? "",
    description: raw.description ?? "",
    status,
    priority,
    dueDate: raw.dueDate,
    createdAt: raw.createdAt,
    category: raw.category,
  };
}

const STATUS_TABS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes", icon: "clock" as const },
  { value: "in_progress", label: "Em Andamento", icon: "loader" as const },
  { value: "done", label: "Concluídas", icon: "check-circle" as const },
];

const PRIORITY_TABS = [
  { value: "all", label: "Qualquer" },
  { value: "high", label: "Alta", icon: "flag" as const },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = taskService.getStats();
  const tasks: Task[] = taskService
    .filter({ status: statusFilter, priority: priorityFilter })
    .map(toTask);

  const handleTaskPress = useCallback((task: Task) => {
    navigate.toTaskDetails(task.id);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const ListHeader = (
    <View>
      <View style={[styles.topBar, { paddingTop: topPad + 12 }]}>
        <View>
          <Text style={styles.greeting}>Olá, usuário!</Text>
          <Text style={styles.subtitle}>Veja suas tarefas de hoje</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={navigate.toCreateTask}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: "Total", value: stats.total, color: theme.colors.primary },
          { label: "Pendentes", value: stats.pending, color: theme.colors.statusPending },
          { label: "Em Andamento", value: stats.in_progress, color: theme.colors.statusInProgress },
          { label: "Concluídas", value: stats.done, color: theme.colors.statusDone },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statNumber, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.filtersSection}>
        <FilterTabs
          label="Status"
          tabs={STATUS_TABS}
          active={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            handleRefresh();
          }}
        />
        <FilterTabs
          label="Prioridade"
          tabs={PRIORITY_TABS}
          active={priorityFilter}
          onChange={(v) => {
            setPriorityFilter(v);
            handleRefresh();
          }}
        />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
        </Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Feather name="refresh-cw" size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={handleTaskPress} />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma tarefa encontrada"
            message="Tente ajustar os filtros ou crie uma nova tarefa"
            buttonTitle="Criar primeira tarefa"
            onButtonPress={navigate.toCreateTask}
          />
        }
        contentContainerStyle={{ paddingBottom: bottomPad + 24 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={tasks.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  greeting: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold as "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: -20,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 4,
    ...theme.shadow.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: theme.spacing.xs,
  },
  statNumber: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold as "700",
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  filtersSection: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  listTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold as "600",
    color: theme.colors.text,
  },
});
