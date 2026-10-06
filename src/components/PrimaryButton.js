import React from 'react';
import { AppText } from './AppText';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

export default function PrimaryButton({ title, onPress, disabled, loading, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <AppText style={styles.text}>{title}</AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: colors.textMuted,
  },
  text: {
    ...typography.button,
  },
});
