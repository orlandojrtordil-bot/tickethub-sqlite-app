import React from 'react';
import { AppText } from './AppText';
import { View, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';
import { formatPeso } from '../utils/formatCurrency';

export default function TicketCard({ booking }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText style={styles.title}>Booking Confirmed</AppText>
        <AppText style={styles.confirmation}>#{booking.confirmation}</AppText>
      </View>
      <View style={styles.routeContainer}>
        <AppText style={styles.city}>{booking.origin}</AppText>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <View style={styles.dot} />
          <View style={styles.line} />
        </View>
        <AppText style={styles.city}>{booking.destination}</AppText>
      </View>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <AppText style={styles.detailLabel}>Date</AppText>
          <AppText style={styles.detailValue}>{booking.date}</AppText>
        </View>
        <View style={styles.detailItem}>
          <AppText style={styles.detailLabel}>Time</AppText>
          <AppText style={styles.detailValue}>{booking.time}</AppText>
        </View>
        <View style={styles.detailItem}>
          <AppText style={styles.detailLabel}>Class</AppText>
          <AppText style={styles.detailValue}>{booking.class}</AppText>
        </View>
        <View style={styles.detailItem}>
          <AppText style={styles.detailLabel}>Passengers</AppText>
          <AppText style={styles.detailValue}>{booking.passengers}</AppText>
        </View>
      </View>
      <View style={styles.footer}>
        <AppText style={styles.totalLabel}>Total Paid</AppText>
        <AppText style={styles.totalValue}>
          {formatPeso(booking.total ?? booking.price, 2)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    margin: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.success,
  },
  confirmation: {
    ...typography.caption,
    color: colors.textMuted,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
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
    width: 24,
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
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  detailItem: {
    width: '50%',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.caption,
    marginBottom: 2,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.accentPale,
  },
  totalLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  totalValue: {
    ...typography.h2,
    color: colors.primary,
  },
});
