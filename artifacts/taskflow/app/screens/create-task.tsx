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
import Input from "../components/Input";
import { navigate } from "../navigation/navigationRef";
import taskService from "../services/taskService";
import theme from "../styles/theme";

const PRIORITIES = [
  { value: "low", label: "Baixa", color: theme.colors.priorityLow },
  { value: "medium", label: "Média", color: theme.colors.priorityMedium },
  { value: "high", label: "Alta", color: theme.colors.priorityHigh },
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Pessoal");
  const [error, setError] = useState("");

  const handleCreate = () => {
    setError("");
    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    taskService.create({
      title: title.trim(),
      description: description.trim(),
      priority,
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
              (Platform.OS === "web" ? 34 : insets.bottom) + theme.spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Título *"
          value={title}
          onChangeText={setTitle}
          placeholder="O que precisa ser feito?"
          maxLength={100}
          error={error && !title.trim() ? error : undefined}
        />

        <Input
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          placeholder="Adicione mais detalhes sobre a tarefa..."
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        <Text style={styles.charCount}>{description.length}/500</Text>

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  section: { gap: theme.spacing.sm },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold as "600",
    color: theme.colors.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  charCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: "right",
    marginTop: -theme.spacing.md,
  },
  priorityRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
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
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium as "500",
    color: theme.colors.textSecondary,
  },
  priorityLabelActive: {
    color: "#FFFFFF",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  categoryBtnActive: {
    backgroundColor: theme.colors.surfaceElevated,
    borderColor: theme.colors.primary,
  },
  categoryLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium as "500",
  },
  categoryLabelActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold as "600",
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
});
