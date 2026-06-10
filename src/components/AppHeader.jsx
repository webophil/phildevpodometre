import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme, spacing, typography, shadows } from '@/theme';

export const AppHeader = ({ title, showSync = true }) => {
  return (
    <View style={styles.container}>
      <Text style={[typography.h2, { color: theme.colors.onSurface }]}>{title}</Text>
      {showSync && (
        <View style={styles.syncIndicator}>
          <MaterialCommunityIcons name="cloud-check-outline" size={20} color={theme.colors.primary} />
          <Text style={[typography.caption, { color: theme.colors.primary, marginLeft: 4 }]}>Synchronisé</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: theme.colors.background,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: theme.roundness,
  },
});
