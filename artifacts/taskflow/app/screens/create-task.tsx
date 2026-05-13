import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigate } from "../navigation/AppNavigator";
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Título *</Text>
          <TextInput
            style={[styles.input, error && !title.trim() ? styles.inputError : null]}
            placeholder="O que precisa ser feito?"
            placeholderTextColor={theme.colors.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Adicione mais detalhes sobre a tarefa..."
            placeholderTextColor={theme.colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data de Vencimento</Text>
          <View style={styles.inputWrapper}>
            <Feather
              name="calendar"
              size={18}
              color={theme.colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputInner}
              placeholder="AAAA-MM-DD (ex: 2026-05-30)"
              placeholderTextColor={theme.colors.textMuted}
              value={dueDate}
              onChangeText={setDueDate}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={14} color={theme.colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={navigate.back}
            activeOpacity={0.75}
          >
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCreate}
            onPress={handleCreate}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.btnCreateText}>Criar Tarefa</Text>
          </TouchableOpacity>
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
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  charCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: "right",
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
  inputIcon: { marginRight: theme.spacing.sm },
  inputInner: {
    flex: 1,
    paddingVertical: 14,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.dangerLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.danger,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  btnCancelText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.semibold as "600",
  },
  btnCreate: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    gap: theme.spacing.sm,
  },
  btnCreateText: {
    fontSize: theme.fontSize.md,
    color: "#FFFFFF",
    fontWeight: theme.fontWeight.bold as "700",
  },
});
