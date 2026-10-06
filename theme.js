// TicketHub Theme — 60-30-10 Color Rule
// 60% neutral: #FFFFFF and #F4F7FA (screen backgrounds, cards)
// 30% secondary: #33658A (headers, primary buttons, active tab, welcome screen)
// 10% accent: #BEE3F8 (selected chips, pills), #86BBD8 (soft blue lines)
// Text: #1F2D3A (primary), #66788A (secondary), #9AAAB8 (muted)

export const colors = {
  // Neutrals (60%)
  white: "#FFFFFF",
  background: "#F4F7FA",
  surface: "#F4F7FA",
  card: "#FFFFFF",

  // Secondary (30%)
  primary: "#33658A",
  primaryDark: "#2A5575",
  primaryLight: "#4A7FA5",

  // Accent (10%)
  accent: "#86BBD8",
  accentLight: "#BEE3F8",
  accentPale: "#EAF3FA",

  // Tiles / tints
  chipBg: "#F0F3F7",
  iconTile: "#EFF2F5",
  divider: "#EDF1F5",

  // Text
  textPrimary: "#1F2D3A",
  textSecondary: "#66788A",
  textMuted: "#9AAAB8",
  textOnPrimary: "#FFFFFF",
  textOnPrimarySoft: "#BBD6E8",

  // Semantic
  success: "#27AE60",
  error: "#E74C3C",
  danger: "#E74C3C",
  border: "#E1E8ED",
  borderSoft: "#E9EEF3",
};

// Inter family names registered through useInterFonts() in AppText.
// Android ignores `fontWeight` once an explicit family is set, so every
// weight maps to its own font file.
export const fontFamilies = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
};

// Backwards-compatible alias (older components imported `fonts`).
export const fonts = fontFamilies;

export const fontFamilyForWeight = (weight) => {
  const w = weight === undefined || weight === null ? "400" : String(weight);
  switch (w) {
    case "100":
    case "200":
    case "300":
    case "400":
    case "normal":
      return fontFamilies.regular;
    case "500":
      return fontFamilies.medium;
    case "600":
      return fontFamilies.semibold;
    case "700":
    case "800":
    case "900":
    case "bold":
      return fontFamilies.bold;
    default:
      return fontFamilies.regular;
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// `fontWeight` is the single source of truth; AppText resolves the matching
// Inter family from it, so components may safely spread and override weight.
export const typography = {
  h1: { fontSize: 28, fontWeight: "700", color: colors.textPrimary },
  h2: { fontSize: 22, fontWeight: "700", color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: "600", color: colors.textPrimary },
  h4: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
  body: { fontSize: 16, fontWeight: "400", color: colors.textPrimary },
  bodySmall: { fontSize: 14, fontWeight: "400", color: colors.textSecondary },
  subtitle: { fontSize: 14, fontWeight: "400", color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: "400", color: colors.textMuted },
  label: { fontSize: 13, fontWeight: "400", color: colors.textSecondary },
  labelSmall: { fontSize: 11, fontWeight: "400", color: colors.textMuted },
  button: { fontSize: 16, fontWeight: "600", color: colors.white },
};

export default {
  colors,
  fonts,
  fontFamilies,
  fontFamilyForWeight,
  spacing,
  radii,
  typography,
};
