import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { theme, spacing, typography, shadows } from '@/theme';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStepsByDate, updateSteps } from '@/api/steps';
import { getUserProfile, calculateMetrics } from '@/api/user';
import { usePedometer } from '@/hooks/usePedometer';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const StepProgressCircle = ({ steps = 0, goal = 10000 }) => {
  const size = 220;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = goal > 0 ? Math.min(steps / goal, 1) : 0;
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: false, // SVG properties don't support native driver
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const percentage = isNaN(progress) ? 0 : Math.round(progress * 100);

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
        <Text style={[typography.hero, { color: theme.colors.onSurface }]}>
          {Number(steps || 0).toLocaleString()}
        </Text>
        <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant }]}>
          sur {Number(goal || 10000).toLocaleString()} pas
        </Text>
        <View style={styles.percentageBadge}>
          <Text style={[typography.caption, { color: theme.colors.primary, fontWeight: '700' }]}>
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const pedometer = usePedometer() || {};
  const totalSteps = pedometer.totalSteps || 0;
  const isPedometerAvailable = pedometer.isPedometerAvailable || 'false';
  
  const [data, setData] = useState({ steps: 0, goal: 10000, distance: '0', calories: 0 });
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stepData = await getStepsByDate(today);
        const userProfile = await getUserProfile();
        
        // Use real steps if available, otherwise fallback to mock/saved data
        const displaySteps = isPedometerAvailable === 'true' ? totalSteps : (stepData?.count || 0);
        
        // Sync real steps to our "database" if they are higher
        if (isPedometerAvailable === 'true' && totalSteps > (stepData?.count || 0)) {
          await updateSteps(today, totalSteps);
        }

        const metrics = calculateMetrics(displaySteps, userProfile || {});
        setData({
          steps: displaySteps,
          goal: stepData?.goal || 10000,
          distance: metrics.distance,
          calories: metrics.calories,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, [totalSteps, isPedometerAvailable]);

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
            <View style={[styles.liveIndicator, { backgroundColor: isPedometerAvailable === 'true' ? theme.colors.primary : theme.colors.error }]} />
            <Text style={[typography.h3, { marginLeft: spacing.sm }]}>
              {isPedometerAvailable === 'true' ? 'Activité en direct' : 'Capteur indisponible'}
            </Text>
          </View>
          <Text style={[typography.hero, { textAlign: 'center', marginVertical: spacing.md }]}>
            {data.steps.toLocaleString()}
          </Text>
          <Text style={[typography.body, { textAlign: 'center', color: theme.colors.onSurfaceVariant }]}>
            {isPedometerAvailable === 'true' 
              ? `Continuez comme ça ! Vous êtes à ${Math.max(0, data.goal - data.steps)} pas de votre objectif.`
              : "Le podomètre n'est pas disponible sur cet appareil ou dans ce navigateur. Utilisation des données simulées."}
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
