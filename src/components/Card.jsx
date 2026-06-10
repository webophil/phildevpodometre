import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme, spacing, shadows } from '@/theme';

export const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 1.5,
    padding: spacing.lg,
    ...shadows.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
