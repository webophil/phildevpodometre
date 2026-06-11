import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme, spacing, typography } from '@/theme';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/Card';
import { getAllSteps } from '@/api/steps';
import { BarChart } from 'react-native-gifted-charts';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

const TimeframeSelector = ({ selected, onSelect }) => {
  const timeframes = [
    { id: '1w', label: '1 sem.' },
    { id: '1m', label: '1 mois' },
    { id: '3m', label: '3 mois' },
    { id: '1y', label: '1 an' },
  ];

  return (
    <View style={styles.timeframeContainer}>
      {timeframes.map((tf) => (
        <TouchableOpacity
          key={tf.id}
          style={[
            styles.timeframeButton,
            selected === tf.id && styles.timeframeButtonActive,
          ]}
          onPress={() => onSelect(tf.id)}
        >
          <Text
            style={[
              typography.caption,
              { fontWeight: '600' },
              selected === tf.id ? { color: theme.colors.onPrimary } : { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {tf.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function HistoryScreen() {
  const [timeframe, setTimeframe] = useState('1w');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({ total: 0, average: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allSteps = await getAllSteps();
        processData(allSteps || [], timeframe);
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeframe]);

  const processData = (data, tf) => {
    let days = 7;
    if (tf === '1m') days = 30;
    if (tf === '3m') days = 90;
    if (tf === '1y') days = 365;

    const lastNDays = Array.from({ length: days }).map((_, i) => {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const entry = data.find((d) => d.date === date);
      return {
        value: entry ? (entry.count || 0) : 0,
        label: format(subDays(new Date(), i), 'dd/MM', { locale: fr }),
        frontColor: entry && entry.count >= 10000 ? theme.colors.primary : theme.colors.secondary,
      };
    }).reverse();

    setChartData(lastNDays.slice(-10)); // Show last 10 for better visibility on mobile

    // Weekly stats
    try {
      const now = new Date();
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      
      const currentWeekSteps = data.filter(d => {
        try {
          const stepDate = new Date(d.date);
          return !isNaN(stepDate.getTime()) && isWithinInterval(stepDate, { start, end });
        } catch (e) {
          return false;
        }
      });

      const total = currentWeekSteps.reduce((acc, curr) => acc + (curr.count || 0), 0);
      const average = currentWeekSteps.length > 0 ? Math.round(total / currentWeekSteps.length) : 0;
      
      setWeeklyStats({ total, average });
    } catch (e) {
      console.error('Error processing weekly stats:', e);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Historique" />
      
      <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />

      <Card style={styles.chartCard}>
        <Text style={[typography.h3, { marginBottom: spacing.lg }]}>Performance des pas</Text>
        {chartData.length > 0 ? (
          <BarChart
            data={chartData}
            barWidth={22}
            noOfSections={4}
            barBorderRadius={4}
            frontColor={theme.colors.primary}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
          />
        ) : (
          <Text style={[typography.body, { textAlign: 'center', color: theme.colors.onSurfaceVariant }]}>
            Aucune donnée disponible
          </Text>
        )}
      </Card>

      <Card>
        <Text style={[typography.h3, { marginBottom: spacing.md }]}>Cumul Hebdomadaire</Text>
        <View style={styles.weeklyStatsRow}>
          <View style={styles.weeklyStatItem}>
            <Text style={[typography.hero, { color: theme.colors.primary }]}>
              {(weeklyStats.total || 0).toLocaleString()}
            </Text>
            <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant }]}>Total de la semaine</Text>
          </View>
          <View style={styles.weeklyStatItem}>
            <Text style={[typography.hero, { color: theme.colors.secondary }]}>
              {(weeklyStats.average || 0).toLocaleString()}
            </Text>
            <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant }]}>Moyenne quotidienne</Text>
          </View>
        </View>
      </Card>
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
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  timeframeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
  },
  timeframeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  chartCard: {
    paddingBottom: spacing.xl,
  },
  weeklyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weeklyStatItem: {
    flex: 1,
  },
});
