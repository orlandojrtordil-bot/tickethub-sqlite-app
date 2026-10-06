import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../theme';

export default function SearchBar({ placeholder, value, onChangeText, style }) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    padding: 0,
  },
});
