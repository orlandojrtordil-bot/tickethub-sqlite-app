import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import FlightPath from "../components/FlightPath";
import { Icon } from "../components/Icon";
import ScreenStatusBar from "../components/ScreenStatusBar";
import { colors, radii, spacing } from "../../theme";
import { useTrips } from "../context/TripContext";
import { useProfile } from "../context/ProfileContext";
import { formatPeso } from "../utils/formatCurrency";
// Booking reference shown on the confirmation screen. addBooking() stores
// whatever we pass in; db.js does not generate references itself.
const makeReference = () => `TH-${Math.floor(10000 + Math.random() * 90000)}`;

const BASE_FARE = 540.0;
const TAXES = 82.5;
const BAGGAGE = 0.0;
const DISCOUNT = -15.0;
const TOTAL = BASE_FARE + TAXES + BAGGAGE + DISCOUNT;

const DETAILS = [
  { icon: "seat", label: "Seat Selection", value: "14A (Window)" },
  { icon: "bag-carry-on", label: "Cabin Bag", value: "1 Carry-on" },
  { icon: "bag-checked", label: "Checked Bag", value: "1 Bag (23kg)" },
  { icon: "shield-check", label: "Cabin Class", value: "Economy Standard" },
];

const PRICE_LINES = [
  { label: "Base Fare", value: BASE_FARE },
  { label: "Taxes & Airport Fees", value: TAXES },
  { label: "Baggage", value: BAGGAGE },
  { label: "Discount", value: DISCOUNT },
];

// Frame 04 — Review Booking (Step 2 of 3).
export default function CheckoutScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { flight } = route.params;
  const [passengers, setPassengers] = useState(1);
  const { addTrip } = useTrips();
  const { profile } = useProfile();

  const handleConfirm = () => {
    const booking = {
      airline: flight.airline,
      flight: flight.flight,
      origin: "JFK",
      originCity: "New York",
      destination: "LHR",
      destinationCity: "London",
      date: "Thu, 24 Oct",
      time: flight.depart,
      arrivalTime: flight.arrive,
      duration: flight.duration,
      stops: "Non-stop",
      class: "Economy",
      price: TOTAL,
      passengers,
      seat: "14A",
      gate: "B22",
      terminal: "Term 4",
      arrivalTerminal: "Terminal 3",
      passenger: profile.fullName,
      baggage: "1 Pc (23kg)",
      confirmation: makeReference(),
    };
    addTrip(booking);
    navigation.navigate("BookingConfirmed", { booking });
  };

  return (
    <View style={styles.container}>
      <ScreenStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Review Booking</AppText>
        <View style={styles.stepBadge}>
          <AppText weight="600" style={styles.stepText}>
            Step 2 of 3
          </AppText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Flight summary */}
        <View style={styles.card}>
          <View style={styles.flightHeader}>
            <View style={styles.airlineLeft}>
              <Icon name="airplane" size={20} />
              <View>
                <AppText weight="600" style={styles.airlineName}>
                  {flight.airline}
                </AppText>
                <AppText style={styles.flightMeta}>{flight.flight}</AppText>
              </View>
            </View>
            <AppText style={styles.nonStop}>Non-stop</AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.timesRow}>
            <View style={styles.timeBlock}>
              <AppText weight="700" style={styles.timeText}>
                {flight.depart}
              </AppText>
              <AppText weight="600" style={styles.airportCode}>
                JFK
              </AppText>
              <AppText style={styles.date}>Thu Oct 24</AppText>
            </View>

            <View style={styles.routeMiddle}>
              <AppText style={styles.duration}>{flight.duration}</AppText>
              <FlightPath planeSize={13} />
            </View>

            <View style={[styles.timeBlock, styles.timeBlockRight]}>
              <AppText weight="700" style={styles.timeText}>
                {flight.arrive}
              </AppText>
              <AppText weight="600" style={styles.airportCode}>
                LHR
              </AppText>
              <AppText style={styles.date}>Thu Oct 24</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.passengerRow}>
            <View style={styles.passengerLeft}>
              <Icon name="account" size={18} />
              <AppText style={styles.passengerLabel}>
                {passengers} Passenger
              </AppText>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setPassengers((n) => Math.max(1, n - 1))}
                accessibilityLabel="Remove passenger"
              >
                <Icon name="minus" size={16} color={colors.primary} />
              </TouchableOpacity>
              <AppText weight="600" style={styles.counterValue}>
                {passengers}
              </AppText>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setPassengers((n) => Math.min(9, n + 1))}
                accessibilityLabel="Add passenger"
              >
                <Icon name="plus" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Flight details */}
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Flight Details</AppText>
          <View style={styles.detailsGrid}>
            {DETAILS.map((detail) => (
              <View key={detail.label} style={styles.detailTile}>
                <View style={styles.detailTileHead}>
                  <Icon name={detail.icon} size={14} color={colors.textSecondary} />
                  <AppText style={styles.detailLabel}>{detail.label}</AppText>
                </View>
                <AppText weight="600" style={styles.detailValue}>
                  {detail.value}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Traveler contact */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText style={styles.cardTitle}>Traveler Contact</AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
              accessibilityRole="button"
              accessibilityLabel="Edit traveler details"
            >
              <AppText weight="600" style={styles.editLink}>
                Edit
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.contactRow}>
            <Icon name="account" size={18} color={colors.textSecondary} />
            <AppText style={styles.contactText}>{profile.fullName}</AppText>
          </View>
          <View style={styles.contactRow}>
            <Icon name="email" size={18} color={colors.textSecondary} />
            <AppText style={styles.contactText}>{profile.email}</AppText>
          </View>
          <View style={[styles.contactRow, styles.contactRowLast]}>
            <Icon name="phone" size={18} color={colors.textSecondary} />
            <AppText style={styles.contactText}>{profile.phone}</AppText>
          </View>
        </View>

        {/* Payment method */}
        <View style={styles.payTile}>
          <Icon name="credit-card" size={24} />
          <View style={styles.payText}>
            <AppText weight="600" style={styles.payTitle}>
              Visa ending in 4282
            </AppText>
            <AppText style={styles.paySub}>Expires 08/26</AppText>
          </View>
          <TouchableOpacity>
            <AppText weight="600" style={styles.editLink}>
              Change
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Price breakdown */}
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Price Breakdown</AppText>
          {PRICE_LINES.map((line) => (
            <View key={line.label} style={styles.priceLine}>
              <AppText style={styles.priceLabel}>{line.label}</AppText>
              <AppText
                style={[
                  styles.priceValue,
                  line.value === DISCOUNT && styles.priceDiscount,
                ]}
              >
                {formatPeso(line.value, 2)}
              </AppText>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.priceLine}>
            <AppText weight="700" style={styles.totalLabel}>
              Total Amount
            </AppText>
            <AppText weight="700" style={styles.totalValue}>
              {formatPeso(TOTAL, 2)}
            </AppText>
          </View>
        </View>

        <View style={styles.secureRow}>
          <Icon name="lock" size={13} color={colors.textMuted} />
          <AppText style={styles.secureText}>
            Encrypted 256-bit instant checkout
          </AppText>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <AppText weight="600" style={styles.confirmText}>
            Confirm Booking
          </AppText>
          <Icon name="arrow-right" size={20} color={colors.white} />
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
    gap: spacing.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  stepBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  stepText: { fontSize: 12, color: colors.primary },

  content: { flex: 1 },
  contentContainer: { padding: spacing.md },

  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },

  // Flight summary
  flightHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  airlineLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  airlineName: { fontSize: 15, color: colors.textPrimary },
  flightMeta: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  nonStop: { fontSize: 13, color: colors.primary },

  timesRow: { flexDirection: "row", alignItems: "center" },
  timeBlock: { flex: 1 },
  timeBlockRight: { alignItems: "flex-end" },
  timeText: { fontSize: 20, color: colors.textPrimary },
  airportCode: { fontSize: 14, color: colors.textPrimary, marginTop: 2 },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  routeMiddle: { flex: 1.6, alignItems: "center", paddingHorizontal: spacing.sm },
  duration: { fontSize: 11, color: colors.textSecondary, marginBottom: 4 },

  passengerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passengerLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  passengerLabel: { fontSize: 15, color: colors.textPrimary },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.xs,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterValue: {
    fontSize: 16,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    minWidth: 16,
    textAlign: "center",
  },

  // Flight details grid
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  detailTile: {
    width: "48.5%",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  detailTileHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  detailLabel: { fontSize: 11, color: colors.textSecondary },
  detailValue: { fontSize: 14, color: colors.textPrimary },

  // Traveler contact
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  contactRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  contactText: { flex: 1, fontSize: 14, color: colors.textPrimary },

  // Payment tile
  payTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.accentPale,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  payText: { flex: 1 },
  payTitle: { fontSize: 15, color: colors.textPrimary },
  paySub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  editLink: { fontSize: 14, color: colors.primary },

  // Price breakdown
  priceLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  priceValue: { fontSize: 14, color: colors.textPrimary },
  priceDiscount: { color: colors.primary },
  totalLabel: { fontSize: 16, color: colors.textPrimary },
  totalValue: { fontSize: 18, color: colors.primary },

  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  secureText: { fontSize: 12, color: colors.textMuted },

  // Footer
  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
  },
  confirmText: { fontSize: 17, color: colors.white },
});
