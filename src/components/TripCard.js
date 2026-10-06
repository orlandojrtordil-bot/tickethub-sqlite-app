import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, radii, spacing, typography } from "../../theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { formatPeso } from "../utils/formatCurrency";

export default function TripCard({ trip, onPress, selected }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.routeGroup}>
          <AppText style={styles.route}>{trip.origin}</AppText>
          <Icon name="plane" size={16} />
          <AppText style={styles.route}>{trip.destination}</AppText>
        </View>
        <AppText style={styles.price}>{formatPeso(trip.price, 0)}</AppText>
      </View>
      <View style={styles.details}>
        <AppText style={styles.detail}>{trip.date}</AppText>
        <AppText style={styles.detail}>{trip.time}</AppText>
        <AppText style={styles.detail}>{trip.class}</AppText>
      </View>
      {trip.passengers && (
        <AppText style={styles.passengers}>
          {trip.passengers} passenger(s)
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentPale,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  route: {
    ...typography.body,
    fontWeight: "600",
    flex: 1,
  },
  routeGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.sm,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
  },
  details: {
    flexDirection: "row",
    gap: spacing.md,
  },
  detail: {
    ...typography.bodySmall,
  },
  passengers: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
