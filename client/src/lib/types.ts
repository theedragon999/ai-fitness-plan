// User fitness data structure
export interface FitnessData {
  source: string; // 'csv', 'manual', 'api'
  dailyAverage: {
    steps: number;
    caloriesBurned: number;
  };
  weeklyTotal: {
    workoutMinutes: number;
  };
  activityLevel: string;
}

// User preferences structure
export interface UserPreferences {
  goal: string; // 'weight-loss', 'muscle-gain', 'endurance', etc.
  dietary: string; // 'no-restrictions', 'vegetarian', 'vegan', etc.
  availableTime: string; // '0-15', '15-30', '30-60', '60+'
  fitnessLevel: number; // 1-5
}

// Data summary structure
export interface DataSummary {
  stats: {
    avgSteps: number;
    stepsChange: number;
    activityLevel: string;
    activeMinutes: number;
    minutesChange: number;
  };
  text: string;
}

// Workout structure
export interface Exercise {
  name: string;
  description: string;
}

// Nutrition structure
export interface Nutrition {
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: string[];
}

// Day plan structure
export interface DayPlan {
  workout: Exercise[];
  nutrition: Nutrition;
  tip: string;
}

// Full fitness plan structure
export interface FitnessPlan {
  id: string;
  userId: number;
  createdAt: string;
  days: {
    monday: DayPlan;
    tuesday: DayPlan;
    wednesday: DayPlan;
    thursday: DayPlan;
    friday: DayPlan;
    saturday: DayPlan;
    sunday: DayPlan;
  };
}

// Progress data structure
export interface ProgressData {
  labels: string[];
  values: number[];
  average: number;
  goal: number;
  progress: number;
}
