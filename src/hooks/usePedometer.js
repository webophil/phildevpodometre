import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export const usePedometer = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const subscribe = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
        if (pastStepCountResult && typeof pastStepCountResult.steps === 'number') {
          setPastStepCount(pastStepCountResult.steps);
        }

        return Pedometer.watchStepCount(result => {
          if (result && typeof result.steps === 'number') {
            setCurrentStepCount(result.steps);
          }
        });
      }
    } catch (error) {
      console.error('Pedometer error:', error);
      setIsPedometerAvailable('false');
    }
  };

  useEffect(() => {
    let subscription;
    subscribe().then(sub => {
      subscription = sub;
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Total steps for today
  const totalSteps = pastStepCount + currentStepCount;

  return {
    isPedometerAvailable,
    totalSteps,
    currentStepCount,
    pastStepCount,
  };
};
