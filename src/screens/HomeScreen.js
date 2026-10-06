import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import FlightPath from "../components/FlightPath";
import { Icon } from "../components/Icon";
import ScreenStatusBar from "../components/ScreenStatusBar";
import { colors, radii, spacing } from "../../theme";
import { useProfile } from "../context/ProfileContext";

// Frame 02 — Home. Blue header with the trip search card overlapping it,
// followed by Upcoming Trips and Travel Essentials.
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [tripType, setTripType] = useState("round");
  const { firstName } = useProfile();

  return (
    <View style={styles.container}>
      <ScreenStatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Icon name="menu" size={24} color={colors.white} />
            <AppText style={styles.logo}>TicketHub</AppText>
          </View>
          <View style={styles.headerRight}>
            <View>
              <Icon name="bell" size={22} color={colors.white} />
              <View style={styles.bellDot} />
            </View>
            <Icon name="account-circle" size={26} color={colors.white} />
          </View>
        </View>

        <AppText style={styles.greeting}>Hi, {firstName || "Traveler"}</AppText>
        <AppText style={styles.headerTitle}>Book Your Trip</AppText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Search card */}
        <View style={styles.searchCard}>
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                tripType === "oneway" && styles.toggleOptionActive,
              ]}
              onPress={() => setTripType("oneway")}
              activeOpacity={0.8}
            >
              <AppText
                weight={tripType === "oneway" ? "600" : "500"}
                style={[
                  styles.toggleText,
                  tripType === "oneway" && styles.toggleTextActive,
                ]}
              >
                One Way
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                tripType === "round" && styles.toggleOptionActive,
              ]}
              onPress={() => setTripType("round")}
              activeOpacity={0.8}
            >
              <AppText
                weight={tripType === "round" ? "600" : "500"}
                style={[
                  styles.toggleText,
                  tripType === "round" && styles.toggleTextActive,
                ]}
              >
                Round Trip
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldsWrap}>
            <View style={styles.field}>
              <Icon name="airplane-takeoff" size={20} />
              <View style={styles.fieldText}>
                <AppText style={styles.fieldLabel}>From</AppText>
                <AppText weight="600" style={styles.fieldValue}>
                  New York (JFK)
                </AppText>
              </View>
            </View>

            <View style={styles.field}>
              <Icon name="airplane-landing" size={20} />
              <View style={styles.fieldText}>
                <AppText style={styles.fieldLabel}>To</AppText>
                <AppText weight="600" style={styles.fieldValue}>
                  London (LHR)
                </AppText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.swapButton}
              activeOpacity={0.8}
              accessibilityLabel="Swap origin and destination"
            >
              <Icon name="swap-vertical" size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Icon name="calendar" size={18} />
              <View style={styles.pillText}>
                <AppText style={styles.pillLabel}>Dates</AppText>
                <AppText weight="600" style={styles.pillValue}>
                  Oct 24 - 28
                </AppText>
              </View>
            </View>
            <View style={styles.pill}>
              <Icon name="account-group" size={18} />
              <View style={styles.pillText}>
                <AppText style={styles.pillLabel}>Travelers</AppText>
                <AppText weight="600" style={styles.pillValue}>
                  1 Adult, Econ
                </AppText>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate("BookTrip")}
            activeOpacity={0.85}
          >
            <Icon name="magnify" size={20} color={colors.white} />
            <AppText weight="600" style={styles.searchButtonText}>
              Search Flights
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Upcoming Trips */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>Upcoming Trips</AppText>
          <TouchableOpacity onPress={() => navigation.navigate("MyTrips")}>
            <AppText weight="600" style={styles.viewAll}>
              View all
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.airlineLeft}>
              <View style={styles.airlineBadge}>
                <AppText weight="700" style={styles.airlineBadgeText}>
                  BA
                </AppText>
              </View>
              <View>
                <AppText weight="600" style={styles.airlineName}>
                  British Airways
                </AppText>
                <AppText style={styles.flightMeta}>BA 178 • Boeing 787</AppText>
              </View>
            </View>
            <View style={styles.statusPill}>
              <AppText weight="600" style={styles.statusText}>
                On Time
              </AppText>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.routeEnd}>
              <AppText style={styles.airportCode}>JFK</AppText>
              <AppText style={styles.city}>New York</AppText>
            </View>

            <View style={styles.routeMiddle}>
              <AppText style={styles.duration}>7h 15m</AppText>
              <FlightPath variant="plain" planeSize={14} />
              <AppText style={styles.stops}>Direct</AppText>
            </View>

            <View style={[styles.routeEnd, styles.routeEndRight]}>
              <AppText style={styles.airportCode}>LHR</AppText>
              <AppText style={styles.city}>London</AppText>
            </View>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.tripFooter}>
            <View>
              <AppText style={styles.metaLabel}>Date &amp; Time</AppText>
              <AppText weight="600" style={styles.metaValue}>
                Tomorrow, 08:30 AM
              </AppText>
            </View>
            <View style={styles.tripFooterRight}>
              <View style={styles.metaColumn}>
                <AppText style={styles.metaLabel}>Gate</AppText>
                <AppText weight="700" style={styles.metaValue}>
                  B22
                </AppText>
              </View>
              <View style={styles.metaColumn}>
                <AppText style={styles.metaLabel}>Seat</AppText>
                <AppText weight="700" style={styles.metaValue}>
                  14B
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* Travel Essentials */}
        <AppText style={[styles.sectionTitle, styles.essentialsHeading]}>
          Travel Essentials
        </AppText>
        <View style={styles.essentialsRow}>
          <View style={styles.essentialsTile}>
            <View style={styles.essentialsIcon}>
              <Icon name="bag-suitcase" size={20} />
            </View>
            <View>
              <AppText weight="600" style={styles.essentialsTitle}>
                Baggage
              </AppText>
              <AppText style={styles.essentialsSub}>Check policy</AppText>
            </View>
          </View>
          <View style={styles.essentialsTile}>
            <View style={styles.essentialsIcon}>
              <Icon name="card-account-details" size={20} />
            </View>
            <View>
              <AppText weight="600" style={styles.essentialsTitle}>
                Check-in
              </AppText>
              <AppText style={styles.essentialsSub}>Online pass</AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  headerRight: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  bellDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  logo: { fontSize: 20, fontWeight: "700", color: colors.white },
  greeting: { fontSize: 14, color: colors.textOnPrimarySoft },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.white,
    marginTop: 2,
  },

  content: { flex: 1 },
  contentContainer: { paddingBottom: spacing.lg },

  // Search card
  searchCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    marginHorizontal: spacing.md,
    marginTop: -spacing.lg,
    padding: spacing.md,
    shadowColor: "#1F2D3A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.chipBg,
    borderRadius: radii.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: radii.sm,
  },
  toggleOptionActive: { backgroundColor: colors.primary },
  toggleText: { fontSize: 14, color: colors.textSecondary },
  toggleTextActive: { color: colors.white },

  fieldsWrap: { position: "relative", marginBottom: spacing.md },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  fieldText: { flex: 1 },
  fieldLabel: { fontSize: 12, color: colors.textMuted },
  fieldValue: { fontSize: 16, color: colors.textPrimary },
  swapButton: {
    position: "absolute",
    right: spacing.md,
    top: 46,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },

  pillRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  pillText: { flex: 1 },
  pillLabel: { fontSize: 12, color: colors.textMuted },
  pillValue: { fontSize: 14, color: colors.textPrimary },

  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
  },
  searchButtonText: { fontSize: 17, color: colors.white },

  // Sections
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
  },
  viewAll: { fontSize: 14, color: colors.primary },

  // Upcoming trip card
  tripCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    marginHorizontal: spacing.md,
    padding: spacing.md,
  },
  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  airlineLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  airlineBadge: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.chipBg,
    alignItems: "center",
    justifyContent: "center",
  },
  airlineBadgeText: { fontSize: 13, color: colors.primary },
  airlineName: { fontSize: 15, color: colors.textPrimary },
  flightMeta: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  statusPill: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  statusText: { fontSize: 12, color: colors.primary },

  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  routeEnd: { flex: 1 },
  routeEndRight: { alignItems: "flex-end" },
  airportCode: { fontSize: 26, fontWeight: "700", color: colors.textPrimary },
  city: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  routeMiddle: { flex: 1.6, alignItems: "center", paddingHorizontal: spacing.sm },
  duration: { fontSize: 11, color: colors.textSecondary, marginBottom: 4 },
  stops: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },

  dashedDivider: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  tripFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tripFooterRight: { flexDirection: "row", gap: spacing.lg },
  metaColumn: { alignItems: "flex-end" },
  metaLabel: { fontSize: 12, color: colors.textMuted },
  metaValue: { fontSize: 16, color: colors.textPrimary, marginTop: 2 },

  // Travel essentials
  essentialsHeading: { marginTop: spacing.lg, marginBottom: spacing.sm },
  essentialsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  essentialsTile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
  },
  essentialsIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  essentialsTitle: { fontSize: 14, color: colors.textPrimary },
  essentialsSub: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
});
