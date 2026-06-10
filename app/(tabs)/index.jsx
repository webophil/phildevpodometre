import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme, spacing, typography, shadows } from '@/theme';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStepsByDate } from '@/api/steps';
import { getUserProfile, calculateMetrics } from '@/api/user';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const StepProgressCircle = ({ steps, goal }) => {
  const size = 220;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(steps / goal, 1);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.circleContainer}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.outlineVariant}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={styles.circleTextContainer}>
        <Text style={[typography.hero, { color: theme.colors.onSurface }]}>{steps.toLocaleString()}</Text>
        <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant }]}>sur {goal.toLocaleString()} pas</Text>
        <View style={styles.percentageBadge}>
          <Text style={[typography.caption, { color: theme.colors.primary, fontWeight: '700' }]}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const [data, setData] = useState({ steps: 0, goal: 10000, distance: '0', calories: 0 });
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      const stepData = await getStepsByDate(today);
      const userProfile = await getUserProfile();
      const metrics = calculateMetrics(stepData.count, userProfile);
      setData({
        steps: stepData.count,
        goal: stepData.goal,
        distance: metrics.distance,
        calories: metrics.calories,
      });
    };
    fetchData();
  }, []);

  return (
    <ScreenWrapper>
      <AppHeader title="Tableau de Bord" />
      
      <View style={styles.mainContent}>
        <StepProgressCircle steps={data.steps} goal={data.goal} />
        
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="map-marker-distance" size={24} color={theme.colors.secondary} />
            <Text style={[typography.h2, { marginTop: spacing.sm }]}>{data.distance}</Text>
            <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant }]}>Kilomètres</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={24} color={theme.colors.tertiary} />
            <Text style={[typography.h2, { marginTop: spacing.sm }]}>{data.calories}</Text>
            <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant }]}>Calories</Text>
          </Card>
        </View>

        <Card style={styles.liveCounterCard}>
          <View style={styles.liveHeader}>
            <View style={styles.liveIndicator} />
            <Text style={[typography.h3, { marginLeft: spacing.sm }]}>Activité en direct</Text>
          </View>
          <Text style={[typography.hero, { textAlign: 'center', marginVertical: spacing.md }]}>
            {data.steps.toLocaleString()}
          </Text>
          <Text style={[typography.body, { textAlign: 'center', color: theme.colors.onSurfaceVariant }]}>
            Continuez comme ça ! Vous êtes à {10000 - data.steps} pas de votre objectif.
          </Text>
        </Card>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    paddingTop: spacing.lg,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  circleTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentageBadge: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.sm,
    alignItems: 'center',
  },
  liveCounterCard: {
    marginTop: spacing.md,
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  liveIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
});
