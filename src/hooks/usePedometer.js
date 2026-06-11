import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Sensors from 'expo-sensors';

// Safely extract Pedometer with a fallback to avoid crashes during import/initialization
const Pedometer = Sensors?.Pedometer || null;

export const usePedometer = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const subscribe = async () => {
    // Pedometer is not supported on web browsers
    if (Platform.OS === 'web') {
      setIsPedometerAvailable('false');
      return;
    }

    try {
      // Check if Pedometer exists and has the necessary methods
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
        // Check for permission methods existence
        if (typeof Pedometer.getPermissionsAsync === 'function') {
          const perms = await Pedometer.getPermissionsAsync();
          isGranted = perms?.status === 'granted' || perms?.granted === true;
        }
        
        if (!isGranted && typeof Pedometer.requestPermissionsAsync === 'function') {
          const perms = await Pedometer.requestPermissionsAsync();
          isGranted = perms?.status === 'granted' || perms?.granted === true;
        }
      } catch (permError) {
        console.warn('Pedometer permission check failed:', permError);
        // On some platforms, we might still be able to try getting steps even if permission check fails
      }

      // If we still don't have permission, we can't proceed with real data
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
        if (typeof Pedometer.getStepCountAsync === 'function') {
          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepCountResult && typeof pastStepCountResult.steps === 'number') {
            setPastStepCount(pastStepCountResult.steps);
          }
        }
      } catch (stepError) {
        console.warn('Error getting past steps:', stepError);
      }

      // Watch for new steps
      if (typeof Pedometer.watchStepCount === 'function') {
        return Pedometer.watchStepCount(result => {
          if (result && typeof result.steps === 'number') {
            setCurrentStepCount(result.steps);
          }
        });
      }
    } catch (error) {
      console.error('Pedometer subscription error:', error);
      setIsPedometerAvailable('false');
    }
  };

  useEffect(() => {
    let subscription;
    let isMounted = true;

    subscribe().then(sub => {
      if (isMounted) {
        subscription = sub;
      } else if (sub && typeof sub.remove === 'function') {
        sub.remove();
      }
    }).catch(err => {
      console.error('Failed to initialize pedometer:', err);
      if (isMounted) setIsPedometerAvailable('false');
    });

    return () => {
      isMounted = false;
      if (subscription && typeof subscription.remove === 'function') {
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
