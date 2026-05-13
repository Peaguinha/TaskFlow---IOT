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
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import { navigate } from "../navigation/navigationRef";
import theme from "../styles/theme";

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
  const topPad = Platform.OS === "web" ? 48 : insets.top;
  const bottomPad = Platform.OS === "web" ? 32 : insets.bottom;

  const { user, logout } = useAuth();
  const { tasks, filterTasks, getStats } = useTasks();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = getStats();
  const filtered = filterTasks({ status: statusFilter, priority: priorityFilter });
  const greetingName = user?.name ?? "usuário";

  const handleTaskPress = useCallback((task: typeof filtered[0]) => {
    navigate.toTaskDetails(task.id);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleLogout = () => {
    logout();
    navigate.toWelcome();
  };

  const ListHeader = (
    <View>
      <View style={[styles.topBar, { paddingTop: topPad + 12 }]}>
        <View style={styles.greetingWrap}>
          <Text style={styles.greeting}>
            Olá, {greetingName}!
          </Text>
          <Text style={styles.subtitle}>Organize suas tarefas de hoje.</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={navigate.toCreateTask}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, styles.logoutBtn]}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Feather name="log-out" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
          {filtered.length} {filtered.length === 1 ? "tarefa" : "tarefas"}
        </Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Feather name="refresh-cw" size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        Platform.OS === "web" ? { maxWidth: 720, alignSelf: "center", width: "100%" } : {},
      ]}
    >
      <FlatList
        data={filtered}
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
        scrollEnabled={filtered.length > 0}
        extraData={refreshKey}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: theme.colors.primary,
  },
  greetingWrap: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 16,
    gap: 4,
    ...theme.shadow.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  filtersSection: {
    paddingTop: 24,
    paddingBottom: 8,
    gap: 16,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 8,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
});
