import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, radii, spacing, typography } from "../../theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export default function PassengerSelector({
  label,
  value,
  onIncrement,
  onDecrement,
}) {
  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={styles.selector}>
        <TouchableOpacity
          style={styles.button}
          onPress={onDecrement}
          activeOpacity={0.7}
        >
          <Icon name="minus" size={18} />
        </TouchableOpacity>
        <AppText style={styles.value}>{value}</AppText>
        <TouchableOpacity
          style={styles.button}
          onPress={onIncrement}
          activeOpacity={0.7}
        >
          <Icon name="plus" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.xs,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: {
    ...typography.body,
    fontWeight: "600",
    marginHorizontal: spacing.md,
    minWidth: 24,
    textAlign: "center",
  },
});
