import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "../../theme";

// The JFK -- plane -- LHR strip shared by Home, Select Trip, Review Booking,
// My Trips and Booking Confirmed. Built from plain Views (no SVG dependency).
// `variant="plain"` renders the plane straight on the line (Home);
// `variant="circle"` renders it inside a light-blue badge (all other screens).
export default function FlightPath({
  variant = "circle",
  lineColor = colors.accent,
  dotSize = 8,
  planeSize = 13,
}) {
  const dot = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
  };

  return (
    <View style={styles.row}>
      <View style={[dot, { backgroundColor: colors.primary }]} />
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      {variant === "plain" ? (
        <View style={styles.plainPlane}>
          <Icon name="airplane" size={planeSize} color={colors.primary} />
        </View>
      ) : (
        <View style={styles.planeCircle}>
          <Icon name="airplane" size={planeSize} color={colors.primary} />
        </View>
      )}
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      <View style={[dot, { backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", width: "100%" },
  line: { flex: 1, height: 2, borderRadius: 1 },
  plainPlane: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  planeCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accentPale,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
});
