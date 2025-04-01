import OpenAI from "openai";
import { FitnessData, UserPreferences, FitnessPlan } from "../client/src/lib/types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

/**
 * Generate a personalized fitness plan based on user data and preferences
 */
export async function generateFitnessPlan(
  fitnessData: FitnessData,
  preferences: UserPreferences
): Promise<FitnessPlan> {
  try {
    // Create a prompt that includes the user's fitness data and preferences
    const prompt = `
      Based on the following user fitness data and preferences, create a personalized 7-day fitness and nutrition plan:
      
      ## User Fitness Data
      - Daily Average Steps: ${fitnessData.dailyAverage.steps}
      - Daily Average Calories Burned: ${fitnessData.dailyAverage.caloriesBurned}
      - Weekly Workout Minutes: ${fitnessData.weeklyTotal.workoutMinutes}
      - Activity Level: ${fitnessData.activityLevel}
      
      ## User Preferences
      - Primary Goal: ${preferences.goal}
      - Dietary Preferences: ${preferences.dietary}
      - Available Time for Exercise: ${preferences.availableTime} minutes per day
      - Fitness Level (1-5): ${preferences.fitnessLevel}
      
      Create a detailed plan with:
      1. Specific workouts for each day (with exercise names, sets, reps or duration)
      2. Nutrition recommendations (macros targets and meal ideas)
      3. A daily motivational tip
      
      Format the response as JSON following this structure exactly:
      {
        "days": {
          "monday": {
            "workout": [
              { "name": "Exercise Name", "description": "Exercise description with sets/reps" }
            ],
            "nutrition": {
              "macros": { "protein": 0, "carbs": 0, "fat": 0 },
              "meals": ["Meal 1 description", "Meal 2 description", "etc."]
            },
            "tip": "Motivational tip for the day"
          },
          "tuesday": { ... },
          // etc. for all days of the week
        }
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a professional fitness trainer and nutritionist, specialized in creating personalized fitness and meal plans based on user data and goals." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    const plan = JSON.parse(content);
    
    // Format into our application's data structure
    const fitnessPlan: FitnessPlan = {
      id: generateUniqueId(),
      userId: 1, // In a real app, would be the actual user ID
      createdAt: new Date().toISOString(),
      days: plan.days
    };

    return fitnessPlan;
  } catch (error) {
    console.error("Error generating fitness plan with OpenAI:", error);
    throw new Error("Failed to generate fitness plan. Please try again later.");
  }
}

/**
 * Generate a unique ID for the plan
 */
function generateUniqueId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
