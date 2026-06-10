import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme, spacing, typography } from '@/theme';

export const Input = ({ label, value, onChangeText, placeholder, keyboardType = 'default', suffix }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={[typography.caption, styles.label]}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[typography.body, styles.input]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
        {suffix && <Text style={[typography.body, styles.suffix]}>{suffix}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundness,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  input: {
    flex: 1,
    color: theme.colors.onSurface,
  },
  suffix: {
    color: theme.colors.onSurfaceVariant,
    marginLeft: spacing.sm,
  },
});
