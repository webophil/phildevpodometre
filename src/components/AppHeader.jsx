import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme, spacing, typography } from '@/theme';
import { Image } from 'expo-image';

export const AppHeader = ({ title, showSync = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image 
          source={require('@/../assets/images/cadrant-monogram-orange.svg')} 
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={[typography.h2, { color: theme.colors.onSurface, marginLeft: spacing.sm }]}>
          {title}
        </Text>
      </View>
      {showSync && (
        <View style={styles.syncIndicator}>
          <MaterialCommunityIcons name="cloud-check-outline" size={18} color={theme.colors.primary} />
          <Text style={[typography.caption, { color: theme.colors.primary, marginLeft: 4 }]}>
            Synchronisé
          </Text>
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
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
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
