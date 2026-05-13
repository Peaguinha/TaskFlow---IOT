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
import { navigate } from "../navigation/navigationRef";
import theme from "../styles/theme";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        <Header
          title="Criar Conta"
          subtitle="Preencha os dados para começar a usar o TaskFlow"
        />

        <View style={styles.form}>
          <Input
            label="Nome completo"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            icon="user"
            autoCapitalize="words"
          />

          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            icon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            icon="lock"
            secureTextEntry
          />

          <Input
            label="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repita a senha"
            icon="lock"
            secureTextEntry
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.simulatedNote}>
            <Text style={styles.simulatedText}>
              Cadastro simulado — os dados não são persistidos (sem backend)
            </Text>
          </View>

          <Button
            title={loading ? "Criando conta..." : "Criar Conta"}
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
          />
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
  form: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  errorBox: {
    backgroundColor: theme.colors.dangerLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.danger,
  },
  simulatedNote: {
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  simulatedText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
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
