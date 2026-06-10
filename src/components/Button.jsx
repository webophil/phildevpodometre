import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme, spacing, typography, shadows } from '@/theme';

export const Button = ({ title, onPress, variant = 'primary', loading = false, style }) => {
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  let backgroundColor = theme.colors.primary;
  let textColor = theme.colors.onPrimary;

  if (isSecondary) {
    backgroundColor = theme.colors.secondary;
  } else if (isOutline) {
    backgroundColor = 'transparent';
    textColor = theme.colors.primary;
  } else if (isDanger) {
    backgroundColor = theme.colors.error;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        isOutline && { borderWidth: 1, borderColor: theme.colors.primary },
        style,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[typography.body, { color: textColor, fontWeight: '600' }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: theme.roundness,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    ...shadows.sm,
  },
});
