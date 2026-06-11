import { format, subDays } from 'date-fns';

// Generate mock data for the last 30 days
const generateMockSteps = () => {
  const steps = [];
  for (let i = 0; i < 30; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    // Random steps between 3000 and 12000
    const count = Math.floor(Math.random() * (12000 - 3000 + 1)) + 3000;
    steps.push({
      id: (30 - i).toString(),
      date,
      count,
      goal: 10000,
    });
  }
  return steps.reverse();
};

export const mockSteps = generateMockSteps();

export const mockUser = {
  id: 'user-1',
  gender: 'Homme',
  height: 180, // in cm
  stepLength: 75, // in cm
  dailyGoal: 10000,
  weight: 75, // in kg
};
