import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { theme, spacing, typography } from '@/theme';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/Card';
import { usePedometer } from '@/hooks/usePedometer';
import { getAllSteps } from '@/api/steps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const ProgressCircle = ({ steps = 0, goal = 10000 }) => {
  const { width } = useWindowDimensions();
  // Ensure width is valid, fallback to a default if 0 (can happen on initial web render)
  const safeWidth = width || 390;
  const CIRCLE_SIZE = Math.min(safeWidth * 0.6, 300);
  const STROKE_WIDTH = 15;
  const RADIUS = Math.max((CIRCLE_SIZE - STROKE_WIDTH) / 2, 0);
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  
  const safeSteps = isNaN(steps) ? 0 : steps;
  const safeGoal = isNaN(goal) || goal <= 0 ? 10000 : goal;
  const progress = Math.min(safeSteps / safeGoal, 1);
  const strokeDashoffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

  if (CIRCLE_SIZE <= 0) return null;

  return (
    <View style={[styles.progressContainer, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }]}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke={theme.colors.surfaceVariant}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke={theme.colors.primary}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={isNaN(strokeDashoffset) ? CIRCUMFERENCE : strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <MaterialCommunityIcons name="shoe-print" size={32} color={theme.colors.primary} />
        <Text style={[typography.hero, { color: theme.colors.onSurface }]}>
          {(safeSteps || 0).toLocaleString()}
        </Text>
        <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant }]}>
          Objectif: {safeGoal.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const { totalSteps, isPedometerAvailable } = usePedometer();
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dailyGoal = 10000;

  useEffect(() => {
    let isMounted = true;
    const fetchWeeklyAverage = async () => {
      try {
        const allSteps = await getAllSteps();
        if (!isMounted) return;

        const now = new Date();
        const start = startOfWeek(now, { weekStartsOn: 1 });
        const end = endOfWeek(now, { weekStartsOn: 1 });
        
        const currentWeekSteps = (allSteps || []).filter(d => {
          try {
            const stepDate = new Date(d.date);
            return !isNaN(stepDate.getTime()) && isWithinInterval(stepDate, { start, end });
          } catch (e) {
            return false;
          }
        });

        const total = currentWeekSteps.reduce((acc, curr) => acc + (curr.count || 0), 0);
        const average = currentWeekSteps.length > 0 ? Math.round(total / currentWeekSteps.length) : 0;
        setWeeklyAverage(average);
      } catch (error) {
        console.error('Error fetching weekly average:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWeeklyAverage();
    return () => { isMounted = false; };
  }, []);

  // Don't block the whole screen if pedometer is still checking, 
  // only block if we are fetching initial data from API
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[typography.body, { marginTop: spacing.md, color: theme.colors.onSurfaceVariant }]}>
          Chargement...
        </Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Podomètre" />
      
      <View style={styles.mainContent}>
        <ProgressCircle steps={totalSteps} goal={dailyGoal} />

        {isPedometerAvailable === 'false' && (
          <Card style={styles.warningCard}>
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.error} />
            <Text style={styles.warningText}>
              Podomètre non disponible. Affichage des données simulées.
            </Text>
          </Card>
        )}

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-week" size={24} color={theme.colors.secondary} />
            <Text style={[typography.h2, { marginTop: spacing.sm }]}>
              {(weeklyAverage || 0).toLocaleString()}
            </Text>
            <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant, textAlign: 'center' }]}>
              Moyenne hebdo
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={24} color="#FF7043" />
            <Text style={[typography.h2, { marginTop: spacing.sm }]}>
              {Math.round((totalSteps || 0) * 0.04)}
            </Text>
            <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant, textAlign: 'center' }]}>
              Calories (kcal)
            </Text>
          </Card>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="information-outline" size={20} color={theme.colors.primary} />
            <Text style={[typography.body, { marginLeft: spacing.sm, flex: 1 }]}>
              {totalSteps >= dailyGoal 
                ? "Félicitations ! Objectif atteint !" 
                : `Encore un effort ! ${Math.round(((totalSteps || 0) / dailyGoal) * 100)}% de l'objectif.`}
            </Text>
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  infoCard: {
    marginHorizontal: spacing.md,
    backgroundColor: theme.colors.primaryContainer,
    borderWidth: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: theme.colors.errorContainer,
    borderColor: theme.colors.error,
    padding: spacing.sm,
  },
  warningText: {
    color: theme.colors.error,
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 12,
    fontWeight: '500',
  },
});
