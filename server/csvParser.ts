import { parse } from 'csv-parse/sync';
import { FitnessData } from '../client/src/lib/types';
import { calculateActivityLevel } from '../client/src/lib/utils';

/**
 * Process CSV data and extract fitness metrics
 */
export async function processCsvData(csvContent: string): Promise<FitnessData> {
  try {
    // Parse the CSV into records
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (!records || records.length === 0) {
      throw new Error("No valid data found in the CSV file");
    }

    // Set up aggregate variables
    let totalSteps = 0;
    let totalCalories = 0;
    let totalWorkoutMinutes = 0;
    let validDays = 0;

    // Different CSV formats may have different column names
    // Try to find steps, calories, and workout data
    for (const record of records) {
      // Check for steps data (different possible column names)
      const steps = getNumericValue(record, ['steps', 'step_count', 'Steps', 'StepCount']);
      if (steps) {
        totalSteps += steps;
        validDays++;
      }

      // Check for calories data (different possible column names)
      const calories = getNumericValue(record, ['calories', 'calorie_burn', 'Calories', 'CaloriesBurned']);
      if (calories) {
        totalCalories += calories;
      }

      // Check for workout minutes (different possible column names)
      const workoutMins = getNumericValue(record, ['workout_minutes', 'active_minutes', 'WorkoutMinutes', 'ActivityMinutes']);
      if (workoutMins) {
        totalWorkoutMinutes += workoutMins;
      }
    }

    // If no valid days were found, throw an error
    if (validDays === 0) {
      throw new Error("Could not find valid step count data in the CSV file");
    }

    // Calculate averages
    const avgSteps = Math.round(totalSteps / validDays);
    const avgCalories = Math.round(totalCalories / validDays);

    // Determine activity level based on steps and workout minutes
    const activityLevel = calculateActivityLevel(avgSteps, totalWorkoutMinutes);

    return {
      source: 'csv',
      dailyAverage: {
        steps: avgSteps,
        caloriesBurned: avgCalories,
      },
      weeklyTotal: {
        workoutMinutes: totalWorkoutMinutes,
      },
      activityLevel,
    };
  } catch (error) {
    console.error("Error processing CSV data:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process CSV data");
  }
}

/**
 * Try to get a numeric value from a record using various possible column names
 */
function getNumericValue(record: Record<string, any>, possibleKeys: string[]): number | null {
  for (const key of possibleKeys) {
    if (record[key] !== undefined) {
      const value = parseFloat(record[key]);
      if (!isNaN(value)) {
        return value;
      }
    }
  }
  return null;
}
