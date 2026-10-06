import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddFlightModal from "../components/AddFlightModal";
import { AppText } from "../components/AppText";
import FlightPath from "../components/FlightPath";
import { Icon } from "../components/Icon";
import ScreenStatusBar from "../components/ScreenStatusBar";
import { addFlight, deleteFlight, getFlights } from "../services/db";
import { formatPeso } from "../utils/formatCurrency";
import { colors, fontFamilies, radii, spacing } from "../../theme";
import { useTrips } from "../context/TripContext";

const FILTERS = ["All", "Fastest", "Cheapest", "Direct", "Morning"];

// Map a `flights` row from the local database onto the fields the existing
// card layout renders (code = first token of the flight number, stops as text).
const mapRow = (row) => ({
  id: row.id,
  airline: row.airline,
  code: String(row.flight_no).split(" ")[0],
  flight: row.flight_no,
  aircraft: row.aircraft,
  depart: row.depart,
  arrive: row.arrive,
  duration: row.duration,
  stops: row.stops === 0 ? "Non-stop" : `${row.stops} stop`,
  price: row.price,
  nextDay: row.next_day === 1,
  seats: row.seats,
});

// Frame 03 — Select Trip. Presented on the root stack above the tab bar, so it
// owns the full screen: header, search + filter, chips, results, sticky total.
export default function BookTripScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const { setSelectedTrip } = useTrips();

  // Reload from SQLite whenever the search text or a filter chip changes.
  const loadFlights = useCallback(() => {
    try {
      const rows = getFlights(search, activeFilter).map(mapRow);
      setFlights(rows);
      // Keep the selection if the flight still exists, otherwise fall back
      // to the first result so the sticky total always has a price.
      setSelectedFlight((prev) =>
        prev && rows.some((row) => row.id === prev.id) ? prev : rows[0] ?? null
      );
    } catch (error) {
      Alert.alert("Could not load flights", String(error?.message ?? error));
    }
  }, [search, activeFilter]);

  useEffect(() => {
    // Defer one tick so the effect reads like an async load (the SQLite read
    // is synchronous) and never cascades a synchronous state update.
    const timer = setTimeout(loadFlights, 0);
    return () => clearTimeout(timer);
  }, [loadFlights]);

  const handleSaveFlight = (form) => {
    try {
      addFlight(form);
      setAddModalVisible(false);
      loadFlights();
    } catch (error) {
      Alert.alert("Could not save flight", String(error?.message ?? error));
    }
  };

  const handleDeleteFlight = (flight) => {
    Alert.alert(
      "Delete flight",
      `Remove ${flight.flight} (${flight.airline}) from the list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            try {
              deleteFlight(flight.id);
              loadFlights();
            } catch (error) {
              Alert.alert(
                "Could not delete flight",
                String(error?.message ?? error)
              );
            }
          },
        },
      ]
    );
  };

  const handleContinue = () => {
    if (!selectedFlight) return;
    setSelectedTrip(selectedFlight);
    navigation.navigate("Checkout", { flight: selectedFlight });
  };

  return (
    <View style={styles.container}>
      <ScreenStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AppText style={styles.headerTitle}>Select Trip</AppText>
          <AppText style={styles.headerSubtitle}>NYC to LON • 24 Oct</AppText>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
          activeOpacity={0.8}
          accessibilityLabel="Add flight"
        >
          <Icon name="plus" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search airline or flight #"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.8}
          accessibilityLabel="Filters"
        >
          <Icon name="tune-vertical" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTERS.map((filter) => {
          const active = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.8}
            >
              <AppText
                weight={active ? "600" : "500"}
                style={[styles.chipText, active && styles.chipTextActive]}
              >
                {filter}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {flights.length === 0 ? (
          <AppText style={styles.emptyText}>No flights match your search.</AppText>
        ) : null}
        {flights.map((flight) => {
          const selected = selectedFlight?.id === flight.id;
          return (
            <View
              key={flight.id}
              style={[styles.card, selected && styles.cardSelected]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.airlineLeft}>
                  <View style={styles.codeBadge}>
                    <AppText weight="700" style={styles.codeText}>
                      {flight.code}
                    </AppText>
                  </View>
                  <View>
                    <AppText weight="600" style={styles.airlineName}>
                      {flight.airline}
                    </AppText>
                    <AppText style={styles.flightMeta}>
                      {flight.flight} • {flight.aircraft}
                    </AppText>
                  </View>
                </View>
                <View style={styles.cardHeaderRight}>
                  <View style={styles.classPill}>
                    <AppText style={styles.classText}>Economy</AppText>
                  </View>
                  <TouchableOpacity
                    style={styles.trashButton}
                    onPress={() => handleDeleteFlight(flight)}
                    activeOpacity={0.8}
                    accessibilityLabel={`Delete flight ${flight.flight}`}
                  >
                    <Icon name="trash" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.timesRow}>
                <View style={styles.timeBlock}>
                  <AppText style={styles.timeText}>{flight.depart}</AppText>
                  <AppText weight="600" style={styles.airportCode}>
                    JFK
                  </AppText>
                  <AppText style={styles.city}>New York</AppText>
                </View>

                <View style={styles.routeMiddle}>
                  <AppText style={styles.duration}>
                    {flight.duration} • {flight.stops}
                  </AppText>
                  <FlightPath planeSize={13} />
                </View>

                <View style={[styles.timeBlock, styles.timeBlockRight]}>
                  <View style={styles.arrivalRow}>
                    <AppText style={styles.timeText}>{flight.arrive}</AppText>
                    {flight.nextDay ? (
                      <AppText weight="700" style={styles.nextDay}>
                        +1
                      </AppText>
                    ) : null}
                  </View>
                  <AppText weight="600" style={styles.airportCode}>
                    LHR
                  </AppText>
                  <AppText style={styles.city}>London</AppText>
                </View>
              </View>

              <View style={styles.dashedDivider} />

              <View style={styles.priceRow}>
                <View>
                  <AppText style={styles.priceLabel}>Price per adult</AppText>
                  <AppText weight="700" style={styles.price}>
                    {formatPeso(flight.price, 0)}
                  </AppText>
                </View>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    selected && styles.selectButtonActive,
                  ]}
                  onPress={() => setSelectedFlight(flight)}
                  activeOpacity={0.85}
                >
                  <AppText weight="600" style={styles.selectText}>
                    Select
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <AppText style={styles.totalLabel}>
            Total Price:{" "}
            <AppText weight="700" style={styles.totalValue}>
              {formatPeso(selectedFlight?.price ?? 0, 0)}
            </AppText>
          </AppText>
          <AppText style={styles.taxLabel}>taxes included</AppText>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <AppText weight="600" style={styles.continueText}>
            Continue
          </AppText>
        </TouchableOpacity>
      </View>

      <AddFlightModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleSaveFlight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerSide: { width: 40, alignItems: "flex-start" },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: colors.textPrimary },
  headerSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 1 },

  // Search + filter
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: fontFamilies.regular,
    padding: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },

  // Filter chips
  filters: { flexGrow: 0, marginTop: spacing.md },
  filtersContent: { paddingHorizontal: spacing.md },
  chip: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.accentLight, borderColor: colors.accentLight },
  chipText: { fontSize: 14, color: colors.textSecondary },
  chipTextActive: { color: colors.primary },

  // Result cards
  list: { flex: 1 },
  listContent: { padding: spacing.md, paddingTop: spacing.sm },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    paddingTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  cardSelected: { borderColor: colors.accent },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  trashButton: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.iconTile,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeader: {
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
  codeBadge: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.chipBg,
    alignItems: "center",
    justifyContent: "center",
  },
  codeText: { fontSize: 14, color: colors.primary },
  airlineName: { fontSize: 15, color: colors.textPrimary },
  flightMeta: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  classPill: {
    backgroundColor: colors.chipBg,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  classText: { fontSize: 12, color: colors.primary },

  timesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  timeBlock: { flex: 1 },
  timeBlockRight: { alignItems: "flex-end" },
  arrivalRow: { flexDirection: "row", alignItems: "flex-start" },
  timeText: { fontSize: 24, fontWeight: "700", color: colors.textPrimary },
  nextDay: { fontSize: 12, color: colors.error, marginLeft: 2, marginTop: 2 },
  airportCode: { fontSize: 14, color: colors.textPrimary, marginTop: 2 },
  city: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  routeMiddle: {
    flex: 1.7,
    alignItems: "center",
    paddingHorizontal: spacing.sm,
  },
  duration: { fontSize: 11, color: colors.textSecondary, marginBottom: 4 },

  dashedDivider: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: { fontSize: 12, color: colors.textMuted },
  price: { fontSize: 22, color: colors.textPrimary, marginTop: 2 },
  selectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
  },
  selectButtonActive: { backgroundColor: colors.primaryDark },
  selectText: { fontSize: 16, color: colors.white },

  // Sticky footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  totalLabel: { fontSize: 15, color: colors.textPrimary },
  totalValue: { fontSize: 18, color: colors.textPrimary },
  taxLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  continueButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg + spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  continueText: { fontSize: 17, color: colors.white },
});
