import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  KeyboardTypeOptions,
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
import theme from "../styles/theme";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

interface FormField {
  label: string;
  icon: FeatherName;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  autoCapitalize: "none" | "sentences" | "words" | "characters";
}

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    setError("");
    if (!name.trim()) {
      setError("Por favor, informe seu nome.");
      return;
    }
    if (!email.trim()) {
      setError("Por favor, informe seu e-mail.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate.toDashboard();
    }, 800);
  };

  const textFields: FormField[] = [
    {
      label: "Nome completo",
      icon: "user",
      value: name,
      onChangeText: setName,
      placeholder: "Seu nome",
      keyboardType: "default",
      autoCapitalize: "words",
    },
    {
      label: "E-mail",
      icon: "mail",
      value: email,
      onChangeText: setEmail,
      placeholder: "seu@email.com",
      keyboardType: "email-address",
      autoCapitalize: "none",
    },
  ];

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
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Feather name="user-plus" size={28} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha os dados para começar a usar o TaskFlow
          </Text>
        </View>

        <View style={styles.form}>
          {textFields.map((field) => (
            <View key={field.label} style={styles.field}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.inputWrapper}>
                <Feather
                  name={field.icon}
                  size={18}
                  color={theme.colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={theme.colors.textMuted}
                  value={field.value}
                  onChangeText={field.onChangeText}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.autoCapitalize}
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Feather
                name="lock"
                size={18}
                color={theme.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.inputWithAction]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={theme.colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={18}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <View style={styles.inputWrapper}>
              <Feather
                name="lock"
                size={18}
                color={theme.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Repita a senha"
                placeholderTextColor={theme.colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={14} color={theme.colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.simulatedNote}>
            <Feather name="info" size={13} color={theme.colors.primaryLight} />
            <Text style={styles.simulatedText}>
              Cadastro simulado — os dados não são persistidos (sem backend)
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.btnRegister, loading && styles.btnDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.btnRegisterText}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={navigate.toLogin}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold as "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  field: { gap: theme.spacing.xs },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold as "600",
    color: theme.colors.text,
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
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  inputWithAction: { paddingRight: theme.spacing.sm },
  eyeBtn: {
    padding: theme.spacing.xs,
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
  simulatedNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  simulatedText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  btnRegister: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: theme.spacing.xs,
  },
  btnDisabled: { opacity: 0.6 },
  btnRegisterText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  footerLink: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold as "600",
  },
});
