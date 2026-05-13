import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
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
import Input from "../components/Input";
import { useTasks, type TaskInput } from "../context/TaskContext";
import { navigate } from "../navigation/navigationRef";
import theme from "../styles/theme";

const PRIORITIES = [
  { value: "low", label: "Baixa", color: theme.colors.priorityLow },
  { value: "medium", label: "Média", color: theme.colors.priorityMedium },
  { value: "high", label: "Alta", color: theme.colors.priorityHigh },
];

const STATUSES = [
  { value: "pending", label: "Pendente", color: theme.colors.statusPending },
  { value: "in_progress", label: "Em Andamento", color: theme.colors.statusInProgress },
  { value: "done", label: "Concluída", color: theme.colors.statusDone },
];

const CATEGORIES = [
  "Acadêmico",
  "Pessoal",
  "Desenvolvimento",
  "Saúde",
  "Trabalho",
  "Outro",
];

export default function CreateTaskScreen() {
  const insets = useSafeAreaInsets();
  const { createTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Pessoal");
  const [error, setError] = useState("");

  const handleCreate = () => {
    setError("");
    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    if (!description.trim()) {
      setError("A descrição é obrigatória.");
      return;
    }
    createTask({
      title: title.trim(),
      description: description.trim(),
      priority: priority as TaskInput["priority"],
      status: status as TaskInput["status"],
      dueDate: dueDate.trim() || undefined,
      category,
    });
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    navigate.toDashboard();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              (Platform.OS === "web" ? 32 : insets.bottom) + 32,
          },
          Platform.OS === "web" ? { maxWidth: 720, alignSelf: "center", width: "100%" } : {},
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Nova Tarefa" subtitle="Preencha os dados da tarefa" />

        <View style={styles.form}>
          <Input
            label="Título *"
            value={title}
            onChangeText={setTitle}
            placeholder="O que precisa ser feito?"
            maxLength={100}
            error={error && !title.trim() ? error : undefined}
          />

          <Input
            label="Descrição *"
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione mais detalhes sobre a tarefa..."
            multiline
            numberOfLines={4}
            maxLength={500}
            error={error && title.trim() && !description.trim() ? error : undefined}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.priorityRow}>
              {STATUSES.map((s) => (
                <TouchableOpacity
                  key={s.value}
                  style={[
                    styles.priorityBtn,
                    status === s.value && {
                      backgroundColor: s.color,
                      borderColor: s.color,
                    },
                  ]}
                  onPress={() => setStatus(s.value)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.priorityLabel,
                      status === s.value && styles.priorityLabelActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prioridade</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityBtn,
                    priority === p.value && {
                      backgroundColor: p.color,
                      borderColor: p.color,
                    },
                  ]}
                  onPress={() => setPriority(p.value)}
                  activeOpacity={0.75}
                >
                  <View
                    style={[
                      styles.priorityDot,
                      {
                        backgroundColor:
                          priority === p.value ? "#FFFFFF" : p.color,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.priorityLabel,
                      priority === p.value && styles.priorityLabelActive,
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    category === cat && styles.categoryBtnActive,
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.categoryLabel,
                      category === cat && styles.categoryLabelActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Data de Vencimento"
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="AAAA-MM-DD (ex: 2026-05-30)"
            icon="calendar"
            keyboardType="numbers-and-punctuation"
          />

          <View style={styles.actions}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={navigate.back}
              style={{ flex: 1 }}
            />
            <Button
              title="Criar Tarefa"
              variant="primary"
              onPress={handleCreate}
              icon={<Feather name="plus" size={18} color="#FFFFFF" />}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    ...(Platform.OS === "web" ? { maxWidth: 720, alignSelf: "center", width: "100%" } : {}),
  },
  form: {
    gap: 16,
    marginTop: 8,
  },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  charCount: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textAlign: "right",
    marginTop: -12,
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityBtn: {
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
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  priorityLabelActive: {
    color: "#FFFFFF",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  categoryBtnActive: {
    backgroundColor: theme.colors.surfaceElevated,
    borderColor: theme.colors.primary,
  },
  categoryLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  categoryLabelActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});
