import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { theme, spacing } from '@/theme';

export const ScreenWrapper = ({ children, contentContainerStyle }) => {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
});
