import React from 'react';
import { AppText } from './AppText';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

export default function DatePill({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AppText style={[styles.text, selected && styles.selectedText]}>{label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  text: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.white,
    fontWeight: '600',
  },
});
