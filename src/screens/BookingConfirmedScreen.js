import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import FlightPath from "../components/FlightPath";
import { Icon } from "../components/Icon";
import ScreenStatusBar from "../components/ScreenStatusBar";
import { colors, radii, spacing } from "../../theme";
import { useProfile } from "../context/ProfileContext";

// Frame 05 — Booking Confirmed.
export default function BookingConfirmedScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { booking } = route.params;
  const { profile } = useProfile();

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(booking.confirmation);
    } catch (_error) {
      // Clipboard is unavailable on very old devices; copying is non-critical.
    }
  };

  return (
    <View style={styles.container}>
      <ScreenStatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerCheck}>
          <Icon name="check" size={18} color={colors.white} />
        </View>
        <AppText style={styles.headerTitle}>Booking Confirmed</AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeTabs")}
          accessibilityLabel="Close"
        >
          <Icon name="close" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.illustration}>
          <View style={styles.illustrationBadge}>
            <Icon name="check" size={16} color={colors.white} />
          </View>
          <Icon name="bag-suitcase" size={64} color={colors.primary} />
        </View>

        <AppText weight="700" style={styles.successTitle}>
          Your trip is booked successfully!
        </AppText>
        <AppText style={styles.successSubtitle}>
          A confirmation email with e-tickets has been sent to{" "}
          <AppText weight="700" style={styles.successEmail}>
            {profile.email}
          </AppText>
        </AppText>

        <View style={styles.ticketCard}>
          <View style={styles.referenceRow}>
            <View>
              <AppText style={styles.referenceLabel}>Booking Reference</AppText>
              <AppText weight="700" style={styles.referenceNumber}>
                {booking.confirmation}
              </AppText>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopy}
              activeOpacity={0.85}
            >
              <Icon name="content-copy" size={15} />
              <AppText weight="600" style={styles.copyText}>
                Copy
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeRow}>
            <View style={styles.routeEnd}>
              <AppText weight="700" style={styles.airportCode}>
                {booking.origin}
              </AppText>
              <AppText style={styles.city}>{booking.originCity}</AppText>
            </View>
            <View style={styles.routeMiddle}>
              <FlightPath planeSize={13} />
            </View>
            <View style={[styles.routeEnd, styles.routeEndRight]}>
              <AppText weight="700" style={styles.airportCode}>
                {booking.destination}
              </AppText>
              <AppText style={styles.city}>{booking.destinationCity}</AppText>
            </View>
          </View>
          <AppText style={styles.routeMeta}>
            {booking.duration || 'Non-stop'} • {booking.stops || ''}
          </AppText>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <AppText style={styles.detailLabel}>Date</AppText>
              <AppText weight="600" style={styles.detailValue}>
                {booking.date}
              </AppText>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <AppText style={styles.detailLabel}>Flight</AppText>
              <AppText weight="600" style={styles.detailValue}>
                {booking.airline} {booking.flight}
              </AppText>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <AppText style={styles.detailLabel}>Seat</AppText>
              <AppText weight="600" style={styles.detailValue}>
                {booking.seat}
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("HomeTabs")}
          activeOpacity={0.85}
        >
          <AppText weight="600" style={styles.primaryButtonText}>
            Back to Home
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate("HomeTabs", { screen: "MyTrips" })
          }
          activeOpacity={0.85}
        >
          <AppText weight="600" style={styles.secondaryButtonText}>
            View in My Trips
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radii.xxl,
    borderBottomRightRadius: radii.xxl,
  },
  headerCheck: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.white },

  content: { flex: 1 },
  contentContainer: { padding: spacing.md },

  illustration: {
    height: 176,
    borderRadius: radii.xl,
    backgroundColor: colors.accentPale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  illustrationBadge: {
    position: "absolute",
    top: 30,
    right: "34%",
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  successTitle: {
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  successEmail: { color: colors.textPrimary },

  ticketCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  referenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  referenceLabel: { fontSize: 12, color: colors.textMuted },
  referenceNumber: {
    fontSize: 22,
    color: colors.primary,
    marginTop: 2,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.accentPale,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
  },
  copyText: { fontSize: 13, color: colors.primary },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },

  routeRow: { flexDirection: "row", alignItems: "center" },
  routeEnd: { flex: 1 },
  routeEndRight: { alignItems: "flex-end" },
  airportCode: { fontSize: 24, color: colors.textPrimary },
  city: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  routeMiddle: { flex: 1.6, paddingHorizontal: spacing.sm },
  routeMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  detailItem: { flex: 1 },
  detailDivider: { width: 1, height: 28, backgroundColor: colors.border },
  detailLabel: { fontSize: 11, color: colors.textMuted },
  detailValue: { fontSize: 14, color: colors.textPrimary, marginTop: 2 },

  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  primaryButton: {
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { fontSize: 17, color: colors.white },
  secondaryButton: {
    height: 52,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { fontSize: 17, color: colors.primary },
});
