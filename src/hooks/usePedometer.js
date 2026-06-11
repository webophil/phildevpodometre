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
      const isAvailable = await Pedometer.isAvailableAsync();
      
      if (!isAvailable) {
        setIsPedometerAvailable('false');
        return;
      }

      // Request permissions - this is where the "cannot read property 'granted' of undefined" 
      // error often occurs if the result is not handled defensively.
      let permissionResult;
      try {
        if (Pedometer.getPermissionsAsync) {
          permissionResult = await Pedometer.getPermissionsAsync();
        }
        
        if (!permissionResult || !permissionResult.granted) {
          if (Pedometer.requestPermissionsAsync) {
            permissionResult = await Pedometer.requestPermissionsAsync();
          }
        }
      } catch (permError) {
        console.warn('Permission check failed:', permError);
      }

      // If we still don't have permission, we can't proceed
      if (!permissionResult || !permissionResult.granted) {
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
