import React from 'react';
import { AppText } from './AppText';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';
import { formatPeso } from '../utils/formatCurrency';

export default function UpcomingCard({ trip, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.routeContainer}>
        <AppText style={styles.city}>{trip.origin}</AppText>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <View style={styles.dot} />
          <View style={styles.line} />
        </View>
        <AppText style={styles.city}>{trip.destination}</AppText>
      </View>
      <View style={styles.details}>
        <AppText style={styles.date}>{trip.date}</AppText>
        <AppText style={styles.time}>{trip.time}</AppText>
      </View>
      <View style={styles.footer}>
        <AppText style={styles.class}>{trip.class}</AppText>
        <AppText style={styles.price}>{formatPeso(trip.price, 0)}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  city: {
    ...typography.h3,
    flex: 1,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: colors.accent,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginHorizontal: 2,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  date: {
    ...typography.bodySmall,
  },
  time: {
    ...typography.bodySmall,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.accentPale,
  },
  class: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  price: {
    ...typography.h3,
    color: colors.primary,
  },
});
