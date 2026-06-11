import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export const usePedometer = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const subscribe = async () => {
    // Pedometer is generally not supported on web browsers
    if (Platform.OS === 'web') {
      setIsPedometerAvailable('false');
      return;
    }

    try {
      // Check if Pedometer is available on the device
      if (!Pedometer || typeof Pedometer.isAvailableAsync !== 'function') {
        setIsPedometerAvailable('false');
        return;
      }

      const isAvailable = await Pedometer.isAvailableAsync();
      
      if (!isAvailable) {
        setIsPedometerAvailable('false');
        return;
      }

      // Robust permission handling
      let isGranted = false;
      try {
        if (typeof Pedometer.getPermissionsAsync === 'function') {
          const perms = await Pedometer.getPermissionsAsync();
          isGranted = perms?.granted === true;
        }
        
        if (!isGranted && typeof Pedometer.requestPermissionsAsync === 'function') {
          const perms = await Pedometer.requestPermissionsAsync();
          isGranted = perms?.granted === true;
        }
      } catch (permError) {
        console.warn('Permission check failed:', permError);
      }

      // If we still don't have permission, we can't proceed
      if (!isGranted) {
        setIsPedometerAvailable('false');
        return;
      }

      setIsPedometerAvailable('true');

      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      // Get steps from the beginning of the day
      try {
        const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
        if (pastStepCountResult && typeof pastStepCountResult.steps === 'number') {
          setPastStepCount(pastStepCountResult.steps);
        }
      } catch (stepError) {
        console.warn('Error getting past steps:', stepError);
      }

      // Watch for new steps
      return Pedometer.watchStepCount(result => {
        if (result && typeof result.steps === 'number') {
          setCurrentStepCount(result.steps);
        }
      });
    } catch (error) {
      console.error('Pedometer error:', error);
      setIsPedometerAvailable('false');
    }
  };

  useEffect(() => {
    let subscription;
    let isMounted = true;

    subscribe().then(sub => {
      if (isMounted) {
        subscription = sub;
      } else if (sub && sub.remove) {
        sub.remove();
      }
    });

    return () => {
      isMounted = false;
      if (subscription && subscription.remove) {
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
