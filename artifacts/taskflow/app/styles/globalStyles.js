import { Platform, StyleSheet } from "react-native";
import colors from "./colors";

const WEB_MAX_WIDTH = 720;

const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === "web"
      ? {
          maxWidth: WEB_MAX_WIDTH,
          alignSelf: "center",
          width: "100%",
        }
      : {}),
  },

  scrollContent: {
    padding: 20,
    gap: 20,
    ...(Platform.OS === "web"
      ? {
          maxWidth: WEB_MAX_WIDTH,
          alignSelf: "center",
          width: "100%",
        }
      : {}),
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      },
    }),
  },

  section: {
    gap: 8,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 32,
  },

  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  text: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },

  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  textMuted: {
    fontSize: 13,
    color: colors.textMuted,
  },

  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPrimaryText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  buttonSecondary: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonSecondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  buttonOutline: {
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  buttonOutlineText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },

  inputError: {
    borderColor: colors.danger,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  errorBox: {
    backgroundColor: colors.dangerLight,
    padding: 12,
    borderRadius: 10,
  },

  errorText: {
    fontSize: 13,
    color: colors.danger,
  },

  infoBox: {
    backgroundColor: colors.surfaceElevated,
    padding: 12,
    borderRadius: 10,
  },

  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  flexRowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  gapSm: { gap: 8 },
  gapMd: { gap: 16 },
  gapLg: { gap: 24 },

  mtSm: { marginTop: 8 },
  mtMd: { marginTop: 16 },
  mtLg: { marginTop: 24 },

  mbSm: { marginBottom: 8 },
  mbMd: { marginBottom: 16 },
  mbLg: { marginBottom: 24 },

  pSm: { padding: 8 },
  pMd: { padding: 16 },
  pLg: { padding: 24 },
});

export default globalStyles;
