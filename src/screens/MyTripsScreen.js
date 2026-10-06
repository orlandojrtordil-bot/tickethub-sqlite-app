import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import FlightPath from "../components/FlightPath";
import { Icon } from "../components/Icon";
import ScreenStatusBar from "../components/ScreenStatusBar";
import { colors, radii, spacing } from "../../theme";
import { useProfile } from "../context/ProfileContext";
import { useTrips } from "../context/TripContext";

// Deterministic bar widths so the ticket barcode looks scanned-in (no SVG dep).
const BARCODE = [
  2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 1, 4, 2, 1, 3, 1, 2, 1, 4, 3, 1, 2, 1, 1,
  3, 2, 4, 1, 2, 1, 3, 1, 1, 2, 4, 1, 3, 1, 2, 1, 1, 4, 2, 3, 1, 2, 1,
];

// Frame 06 — My Trips. Perforated ticket card with a barcode stub.
export default function MyTripsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("upcoming");
  const { trips } = useTrips();
  const { profile } = useProfile();

  return (
    <View style={styles.container}>
      <ScreenStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <AppText style={styles.title}>My Trips</AppText>
        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.8}
          accessibilityLabel="Filter trips"
        >
          <Icon name="tune-vertical" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.tabActive]}
          onPress={() => setActiveTab("upcoming")}
          activeOpacity={0.85}
        >
          <AppText
            weight={activeTab === "upcoming" ? "600" : "500"}
            style={[styles.tabText, activeTab === "upcoming" && styles.tabTextActive]}
          >
            Upcoming ({trips.length})
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.tabActive]}
          onPress={() => setActiveTab("past")}
          activeOpacity={0.85}
        >
          <AppText
            weight={activeTab === "past" ? "600" : "500"}
            style={[styles.tabText, activeTab === "past" && styles.tabTextActive]}
          >
            Past (3)
          </AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {activeTab === "past" ? (
          <View style={styles.emptyState}>
            <Icon name="ticket-outline" size={40} color={colors.textMuted} />
            <AppText style={styles.emptyText}>
              No past trips to show yet.
            </AppText>
          </View>
        ) : (
          trips.map((trip) => (
            <View key={trip.id} style={styles.ticketCard}>
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <View style={styles.airlineLeft}>
                    <View style={styles.airlineBadge}>
                      <Icon name="airplane" size={18} />
                    </View>
                    <View>
                      <AppText weight="600" style={styles.airlineName}>
                        {trip.airline}
                      </AppText>
                      <AppText style={styles.flightMeta}>
                        Flight {trip.flight} • {trip.class}
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.statusBlock}>
                    <View style={styles.statusPill}>
                      <AppText weight="600" style={styles.statusText}>
                        {trip.status}
                      </AppText>
                    </View>
                    <AppText style={styles.pnr}>PNR: {trip.pnr}</AppText>
                  </View>
                </View>

                <View style={styles.routeRow}>
                  <View style={styles.routeEnd}>
                    <AppText style={styles.airportCode}>{trip.origin}</AppText>
                    <AppText style={styles.city}>{trip.originCity}</AppText>
                    <AppText weight="600" style={styles.time}>
                      {trip.time}
                    </AppText>
                    <AppText style={styles.terminal}>
                      {trip.terminal} • Gate {trip.gate}
                    </AppText>
                  </View>

                  <View style={styles.routeMiddle}>
                    <AppText style={styles.duration}>{trip.duration}</AppText>
                    <FlightPath planeSize={13} />
                    <AppText style={styles.stops}>Non-stop</AppText>
                  </View>

                  <View style={[styles.routeEnd, styles.routeEndRight]}>
                    <AppText style={styles.airportCode}>
                      {trip.destination}
                    </AppText>
                    <AppText style={styles.city}>{trip.destinationCity}</AppText>
                    <AppText weight="600" style={styles.time}>
                      {trip.arrivalTime}
                    </AppText>
                    <AppText style={styles.terminal}>
                      {trip.arrivalTerminal}
                    </AppText>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <AppText style={styles.detailLabel}>Passenger</AppText>
                    <AppText weight="600" style={styles.detailValue}>
                      {profile.fullName}
                    </AppText>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailItem}>
                    <AppText style={styles.detailLabel}>Seat</AppText>
                    <AppText weight="600" style={styles.detailValue}>
                      {trip.seat}
                    </AppText>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailItem}>
                    <AppText style={styles.detailLabel}>Baggage</AppText>
                    <AppText weight="600" style={styles.detailValue}>
                      {trip.baggage}
                    </AppText>
                  </View>
                </View>
              </View>

              {/* Perforated tear line: notches are clipped by the card radius */}
              <View style={styles.perforation}>
                <View style={[styles.notch, styles.notchLeft]} />
                <View style={styles.dashedLine} />
                <View style={[styles.notch, styles.notchRight]} />
              </View>

              {/* Barcode stub */}
              <View style={styles.stub}>
                <View style={styles.barcode}>
                  {BARCODE.map((width, index) => (
                    <View
                      key={index}
                      style={[styles.bar, { width, marginRight: index % 3 === 0 ? 3 : 2 }]}
                    />
                  ))}
                </View>
                <AppText style={styles.barcodeText}>006 2481 9283 01</AppText>
              </View>

              {/* Ticket actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.outlineButton}
                  activeOpacity={0.85}
                >
                  <Icon name="silverware-fork-knife" size={18} />
                  <AppText weight="600" style={styles.outlineButtonText}>
                    Add Meal &amp; Amenities
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  activeOpacity={0.85}
                >
                  <Icon name="download" size={18} color={colors.white} />
                  <AppText weight="600" style={styles.primaryButtonText}>
                    Download Ticket
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: { fontSize: 24, fontWeight: "700", color: colors.textPrimary },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.iconTile,
    alignItems: "center",
    justifyContent: "center",
  },

  toggleRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  tab: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 14, color: colors.textSecondary },
  tabTextActive: { color: colors.white },

  content: { flex: 1 },
  contentContainer: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },

  emptyState: { alignItems: "center", paddingTop: spacing.xxl, gap: spacing.md },
  emptyText: { fontSize: 14, color: colors.textMuted },

  // Ticket card
  ticketCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    shadowColor: "#1F2D3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardBody: { padding: spacing.md },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    backgroundColor: colors.accentPale,
    alignItems: "center",
    justifyContent: "center",
  },
  airlineName: { fontSize: 15, color: colors.textPrimary },
  flightMeta: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  statusBlock: { alignItems: "flex-end" },
  statusPill: {
    backgroundColor: colors.accentPale,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  statusText: { fontSize: 12, color: colors.primary },
  pnr: { fontSize: 11, color: colors.textMuted, marginTop: 4 },

  // Route
  routeRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.md },
  routeEnd: { flex: 1 },
  routeEndRight: { alignItems: "flex-end" },
  airportCode: { fontSize: 24, fontWeight: "700", color: colors.textPrimary },
  city: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  time: { fontSize: 14, color: colors.textPrimary, marginTop: spacing.sm },
  terminal: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  routeMiddle: { flex: 1.6, alignItems: "center", paddingHorizontal: spacing.sm, paddingTop: 2 },
  duration: { fontSize: 11, color: colors.textSecondary, marginBottom: 4 },
  stops: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },

  // Details
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  detailItem: { flex: 1 },
  detailDivider: { width: 1, height: 28, backgroundColor: colors.divider },
  detailLabel: { fontSize: 11, color: colors.textMuted },
  detailValue: { fontSize: 14, color: colors.textPrimary, marginTop: 2 },

  // Perforation
  perforation: {
    flexDirection: "row",
    alignItems: "center",
    height: 22,
    backgroundColor: colors.card,
  },
  notch: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.background,
  },
  notchLeft: { marginLeft: -11 },
  notchRight: { marginRight: -11 },
  dashedLine: {
    flex: 1,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    marginHorizontal: spacing.sm,
  },

  // Barcode stub
  stub: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  barcode: { flexDirection: "row", alignItems: "center", height: 44 },
  bar: { height: 44, backgroundColor: colors.textPrimary },
  barcodeText: {
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginTop: spacing.sm,
  },

  // Actions
  actions: { padding: spacing.md, gap: spacing.sm },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 40,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: colors.white,
  },
  outlineButtonText: { fontSize: 15, color: colors.primary },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
  },
  primaryButtonText: { fontSize: 16, color: colors.white },
});
