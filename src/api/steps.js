import { mockSteps } from '../data/data';

let steps = [...mockSteps];

export const getAllSteps = async () => {
  return [...steps].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getStepsByDate = async (date) => {
  return steps.find(s => s.date === date) || { date, count: 0, goal: 10000 };
};

export const updateSteps = async (date, count) => {
  const index = steps.findIndex(s => s.date === date);
  if (index !== -1) {
    steps[index] = { ...steps[index], count };
    return steps[index];
  } else {
    const newEntry = { id: Math.random().toString(), date, count, goal: 10000 };
    steps.push(newEntry);
    return newEntry;
  }
};

export const resetSteps = async () => {
  steps = [];
  return true;
};
