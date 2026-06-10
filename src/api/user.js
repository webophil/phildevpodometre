import { mockUser } from '../data/data';

let user = { ...mockUser };

export const getUserProfile = async () => {
  return { ...user };
};

export const updateUserProfile = async (updates) => {
  user = { ...user, ...updates };
  return { ...user };
};

export const calculateMetrics = (steps, userProfile) => {
  const distanceKm = (steps * (userProfile.stepLength || 75)) / 100000;
  // Rough estimate: 0.04 kcal per step
  const calories = steps * 0.04;
  return {
    distance: distanceKm.toFixed(2),
    calories: Math.round(calories),
  };
};
