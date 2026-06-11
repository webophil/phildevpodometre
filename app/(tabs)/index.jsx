import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme, spacing, typography } from '@/theme';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/Card';
import { usePedometer } from '@/hooks/usePedometer';
import { getAllSteps } from '@/api/steps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.6;
const STROKE_WIDTH = 15;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ProgressCircle = ({ steps, goal }) => {
  const progress = Math.min(steps / goal, 1);
  const strokeDashoffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

  return (
    <View style={styles.progressContainer}>
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
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <MaterialCommunityIcons name="shoe-print" size={32} color={theme.colors.primary} />
        <Text style={[typography.hero, { color: theme.colors.onSurface }]}>
          {steps.toLocaleString()}
        </Text>
        <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant }]}>
          Objectif: {goal.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const { totalSteps, isPedometerAvailable } = usePedometer();
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const dailyGoal = 10000; // This could come from user settings

  useEffect(() => {
    const fetchWeeklyAverage = async () => {
      const allSteps = await getAllSteps();
      const now = new Date();
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      
      const currentWeekSteps = allSteps.filter(d => 
        isWithinInterval(new Date(d.date), { start, end })
      );

      const total = currentWeekSteps.reduce((acc, curr) => acc + curr.count, 0);
      const average = currentWeekSteps.length > 0 ? Math.round(total / currentWeekSteps.length) : 0;
      setWeeklyAverage(average);
    };

    fetchWeeklyAverage();
  }, []);

  return (
    <ScreenWrapper>
      <AppHeader title="Accueil" />
      
      <View style={styles.mainContent}>
        <ProgressCircle steps={totalSteps} goal={dailyGoal} />

        {isPedometerAvailable === 'false' && (
          <Text style={styles.warningText}>
            Le podomètre n'est pas disponible sur cet appareil (ou en mode web).
          </Text>
        )}

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-week" size={24} color={theme.colors.secondary} />
            <Text style={[typography.h2, { marginTop: spacing.sm }]}>
              {weeklyAverage.toLocaleString()}
            </Text>
            <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant, textAlign: 'center' }]}>
              Moyenne hebdo
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={24} color="#FF7043" />
            <Text style={[typography.h2, { marginTop: spacing.sm }]}>
              {Math.round(totalSteps * 0.04)}
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
              Continuez comme ça ! Vous avez atteint {Math.round((totalSteps / dailyGoal) * 100)}% de votre objectif aujourd'hui.
            </Text>
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
  warningText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    fontSize: 12,
  },
});
