import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { Icon } from "../components/Icon";
import ScreenStatusBar from "../components/ScreenStatusBar";
import { colors, spacing } from "../../theme";

// Frame 01 — Welcome. Deep blue canvas, orbital rings around a white plane,
// a dashed flight path with origin/destination dots and a circular CTA.
export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScreenStatusBar style="light" />

      <View style={[styles.graphic, { marginTop: insets.top + spacing.lg }]}>
        <View style={[styles.orbit, styles.orbitOuter]} />
        <View style={[styles.orbit, styles.orbitMiddle]} />
        <View style={[styles.orbit, styles.orbitInner]} />

        {/* Dashed flight path + endpoint markers */}
        <View style={styles.path} />
        <View style={[styles.pathDot, styles.pathDotOrigin]} />
        <View style={styles.pathTarget} />
        <View style={styles.pathTargetCenter} />

        <View style={styles.planeCircle}>
          <Icon name="airplane" size={34} color={colors.white} />
        </View>
      </View>

      <View style={styles.copy}>
        <AppText style={styles.title}>Elevate Your Travel Experience</AppText>
        <AppText style={styles.subtitle}>
          Discover seamless flights, curated stays, and effortless journey
          management at your fingertips.
        </AppText>
      </View>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <View style={styles.buttonHaloOuter}>
          <View style={styles.buttonHaloInner}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace("HomeTabs")}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Tap to Begin"
            >
              <Icon name="arrow-right" size={26} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <AppText style={styles.tapText}>Tap to Begin</AppText>
      </View>
    </View>
  );
}

const PATH_ANGLE = "-42deg";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
  },

  graphic: { width: 300, height: 300, alignItems: "center", justifyContent: "center" },

  orbit: { position: "absolute", borderWidth: 1.5 },
  orbitOuter: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: "rgba(190,227,248,0.18)",
  },
  orbitMiddle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderColor: "rgba(190,227,248,0.28)",
  },
  orbitInner: {
    width: 148,
    height: 148,
    borderRadius: 74,
    borderColor: "rgba(190,227,248,0.40)",
    backgroundColor: "rgba(190,227,248,0.10)",
  },

  path: {
    position: "absolute",
    width: 300,
    borderTopWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(190,227,248,0.85)",
    transform: [{ rotate: PATH_ANGLE }],
  },
  pathDot: { position: "absolute", width: 10, height: 10, borderRadius: 5 },
  pathDotOrigin: {
    left: 34,
    top: 245,
    backgroundColor: colors.accentLight,
  },
  pathTarget: {
    left: 250,
    top: 39,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: "rgba(190,227,248,0.55)",
  },
  pathTargetCenter: {
    position: "absolute",
    left: 257,
    top: 46,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentLight,
  },

  planeCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(190,227,248,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  copy: { alignItems: "center" },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textOnPrimarySoft,
    textAlign: "center",
    lineHeight: 26,
  },

  footer: { alignItems: "center" },
  buttonHaloOuter: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "rgba(190,227,248,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonHaloInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(190,227,248,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  tapText: {
    color: colors.textOnPrimarySoft,
    fontSize: 15,
    marginTop: spacing.md,
  },
});
