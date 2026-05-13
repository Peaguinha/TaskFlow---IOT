import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigate } from "../navigation/AppNavigator";
import theme from "../styles/theme";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <LinearGradient
      colors={["#3730A3", "#4F46E5", "#6366F1"]}
      style={styles.gradient}
    >
      <View
        style={[
          styles.container,
          { paddingTop: topPad + 24, paddingBottom: bottomPad + 24 },
        ]}
      >
        <View style={styles.hero}>
          <View style={styles.iconWrapper}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>TaskFlow</Text>
          <Text style={styles.tagline}>Organize suas tarefas,{"\n"}alcance seus objetivos</Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: "check-circle", text: "Crie e gerencie tarefas facilmente" },
            { icon: "bar-chart-2", text: "Filtre por status e prioridade" },
            { icon: "zap", text: "Acompanhe seu progresso diário" },
          ].map((item) => (
            <View key={item.text} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Feather name={item.icon as any} size={18} color="#4F46E5" />
              </View>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={navigate.toLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={navigate.toRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Criar Conta</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Projeto acadêmico • Fase 1 — Interface Web & Mobile
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "space-between",
  },
  hero: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  icon: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },
  appName: {
    fontSize: 38,
    fontWeight: theme.fontWeight.bold as "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.fontSize.lg,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 26,
  },
  features: {
    gap: theme.spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: theme.fontSize.md,
    color: "rgba(255,255,255,0.9)",
    flex: 1,
    fontWeight: theme.fontWeight.medium as "500",
  },
  actions: {
    gap: theme.spacing.md,
  },
  btnPrimary: {
    backgroundColor: "#FFFFFF",
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as "700",
  },
  btnSecondary: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  btnSecondaryText: {
    color: "#FFFFFF",
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold as "600",
  },
  disclaimer: {
    textAlign: "center",
    fontSize: theme.fontSize.xs,
    color: "rgba(255,255,255,0.5)",
    marginTop: theme.spacing.xs,
  },
});
