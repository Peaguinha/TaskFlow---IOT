import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import theme from "../styles/theme";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: object;
}

const VARIANT_STYLES: Record<
  ButtonVariant,
  { bg: string; text: string; border: string; borderWidth: number }
> = {
  primary: {
    bg: theme.colors.primary,
    text: theme.colors.textOnPrimary,
    border: theme.colors.primary,
    borderWidth: 0,
  },
  secondary: {
    bg: theme.colors.surfaceElevated,
    text: theme.colors.primary,
    border: theme.colors.surfaceElevated,
    borderWidth: 0,
  },
  danger: {
    bg: theme.colors.danger,
    text: "#FFFFFF",
    border: theme.colors.danger,
    borderWidth: 0,
  },
  outline: {
    bg: "transparent",
    text: theme.colors.textSecondary,
    border: theme.colors.border,
    borderWidth: 1.5,
  },
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  style,
}: ButtonProps) {
  const v = VARIANT_STYLES[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.borderWidth,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.text, { color: v.text }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  text: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as "700",
  },
});
