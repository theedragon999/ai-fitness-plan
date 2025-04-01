import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { processCsvData } from "./csvParser";
import { generateFitnessPlan } from "./openai";
import { fetchAppleHealthData, handleAppleHealthCallback } from "./appleHealth";
import { setupAuth } from "./auth";

// Set up multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  // File upload endpoint
  app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const fileContent = req.file.buffer.toString('utf8');
      const processedData = await processCsvData(fileContent);
      
      // Store the processed data
      const userId = req.user.id;
      await storage.saveFitnessData(userId, processedData);
      
      return res.status(200).json(processedData);
    } catch (error) {
      console.error('Error processing CSV:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred processing the file' 
      });
    }
  });
  
  // Manual data entry endpoint
  app.post('/api/fitness-data', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const fitnessData = req.body;
      
      // Validate the data
      if (!fitnessData || !fitnessData.dailyAverage) {
        return res.status(400).json({ message: 'Invalid fitness data format' });
      }
      
      // Store the fitness data
      const userId = req.user.id;
      await storage.saveFitnessData(userId, fitnessData);
      
      return res.status(200).json(fitnessData);
    } catch (error) {
      console.error('Error saving fitness data:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred saving the data' 
      });
    }
  });
  
  // Save preferences endpoint
  app.post('/api/preferences', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const preferences = req.body;
      
      // Validate the data
      if (!preferences || !preferences.goal) {
        return res.status(400).json({ message: 'Invalid preferences format' });
      }
      
      // Store the preferences
      const userId = req.user.id;
      await storage.savePreferences(userId, preferences);
      
      return res.status(200).json(preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred saving preferences' 
      });
    }
  });
  
  // Generate plan endpoint
  app.post('/api/generate-plan', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const userId = req.user.id;
      
      // Get the user's fitness data and preferences
      const fitnessData = await storage.getFitnessData(userId);
      const preferences = await storage.getPreferences(userId);
      
      if (!fitnessData || !preferences) {
        return res.status(400).json({ 
          message: 'Missing fitness data or preferences. Please complete steps 1 and 2 first.' 
        });
      }
      
      // Generate the fitness plan using OpenAI
      const plan = await generateFitnessPlan(fitnessData, preferences);
      
      // Store the plan
      await storage.savePlan(userId, plan);
      
      return res.status(200).json(plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred generating the plan' 
      });
    }
  });
  
  // Get current plan endpoint
  app.get('/api/plans/current', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const userId = req.user.id;
      const plan = await storage.getCurrentPlan(userId);
      
      // If no plan exists, return a starter plan instead of 404
      if (!plan) {
        // Create a starter plan with basic recommendations
        const starterPlan = {
          id: 'starter_plan_' + Date.now(),
          userId: userId,
          createdAt: new Date().toISOString(),
          days: {
            monday: createDefaultDayPlan('monday'),
            tuesday: createDefaultDayPlan('tuesday'),
            wednesday: createDefaultDayPlan('wednesday'),
            thursday: createDefaultDayPlan('thursday'),
            friday: createDefaultDayPlan('friday'),
            saturday: createDefaultDayPlan('saturday'),
            sunday: createDefaultDayPlan('sunday')
          }
        };
        
        // Save this as the current plan
        await storage.savePlan(userId, starterPlan);
        
        return res.status(200).json(starterPlan);
      }
      
      return res.status(200).json(plan);
    } catch (error) {
      console.error('Error retrieving plan:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred retrieving the plan' 
      });
    }
  });
  
  // Helper function to create a default day plan
  function createDefaultDayPlan(day: string) {
    // Different workouts for different days
    let workout = [];
    
    switch(day) {
      case 'monday':
        workout = [
          { name: 'Push-ups', description: '3 sets of 10 reps' },
          { name: 'Squats', description: '3 sets of 15 reps' }
        ];
        break;
      case 'tuesday':
        workout = [
          { name: 'Walking', description: '30 minutes at moderate pace' },
          { name: 'Stretching', description: '15 minutes full body stretch' }
        ];
        break;
      case 'wednesday':
        workout = [
          { name: 'Plank', description: '3 sets of 30 seconds' },
          { name: 'Lunges', description: '3 sets of 10 reps each leg' }
        ];
        break;
      case 'thursday':
        workout = [
          { name: 'Rest Day', description: 'Active recovery or light walking' }
        ];
        break;
      case 'friday':
        workout = [
          { name: 'Jumping Jacks', description: '3 sets of 30 seconds' },
          { name: 'Bicep Curls', description: '3 sets of 12 reps with light weights' }
        ];
        break;
      case 'saturday':
        workout = [
          { name: 'Jogging', description: '20 minutes at comfortable pace' },
          { name: 'Crunches', description: '3 sets of 15 reps' }
        ];
        break;
      default:
        workout = [
          { name: 'Rest Day', description: 'Light stretching and walking' }
        ];
    }
    
    return {
      workout,
      nutrition: {
        macros: {
          protein: 120,
          carbs: 200,
          fat: 65
        },
        meals: [
          'Breakfast: Greek yogurt with berries and granola',
          'Lunch: Grilled chicken salad with olive oil dressing',
          'Dinner: Baked salmon with roasted vegetables',
          'Snack: Apple with almond butter'
        ]
      },
      tip: `Focus on staying hydrated today and getting enough rest. ${day.charAt(0).toUpperCase() + day.slice(1)} is a good day to ${day === 'sunday' || day === 'thursday' ? 'recover' : 'build strength'}.`
    };
  }
  
  // Get data summary endpoint
  app.get('/api/summary', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const userId = req.user.id;
      const fitnessData = await storage.getFitnessData(userId);
      
      if (!fitnessData) {
        return res.status(404).json({ message: 'No fitness data found' });
      }
      
      // Create a summary of the fitness data
      const summary = {
        stats: {
          avgSteps: fitnessData.dailyAverage.steps,
          stepsChange: 12, // In a real app, would calculate based on historical data
          activityLevel: fitnessData.activityLevel,
          activeMinutes: fitnessData.weeklyTotal.workoutMinutes,
          minutesChange: -8, // In a real app, would calculate based on historical data
        },
        text: "Based on your data, you're maintaining a moderately active lifestyle but could benefit from more structured workouts. Your step count is good, but your active minutes have decreased recently. With your weight loss goal, we recommend a mix of cardio and strength training."
      };
      
      return res.status(200).json(summary);
    } catch (error) {
      console.error('Error retrieving summary:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred retrieving the summary' 
      });
    }
  });
  
  // Get progress data endpoint
  app.get('/api/progress', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { type = 'steps', period = 'week' } = req.query;
      const userId = req.user.id;
      
      // In this version, we're generating sample progress data based on fitness data
      // In a production app, we would store and retrieve actual historical data
      const fitnessData = await storage.getFitnessData(userId);
      
      if (!fitnessData) {
        return res.status(404).json({ message: 'No fitness data found' });
      }
      
      // Generate sample progress data based on fitness data
      const baseValue = fitnessData.dailyAverage.steps;
      const progressData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [
          Math.round(baseValue * 0.8), 
          Math.round(baseValue * 1.1), 
          Math.round(baseValue * 1.2), 
          Math.round(baseValue * 0.9), 
          Math.round(baseValue * 1.0), 
          Math.round(baseValue * 1.3), 
          Math.round(baseValue * 0.85)
        ],
        average: Math.round(baseValue * 1.02),
        goal: Math.round(baseValue * 1.1),
        progress: 92.8
      };
      
      return res.status(200).json(progressData);
    } catch (error) {
      console.error('Error retrieving progress data:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred retrieving progress data' 
      });
    }
  });
  
  // Simple user profile endpoint
  app.get('/api/profile', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Return the authenticated user's profile information
      const { id, username, name, email } = req.user;
      return res.status(200).json({ 
        id, 
        username, 
        name: name || username,
        email 
      });
    } catch (error) {
      console.error('Error retrieving profile:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred retrieving profile' 
      });
    }
  });
  
  // Connect to Apple Health
  app.get('/api/connect/apple-health', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const userId = req.user.id;
      
      // In a production app, this would redirect to Apple's OAuth flow
      // Here we simulate fetching and processing the data
      const healthData = await fetchAppleHealthData();
      
      // Store the data
      await storage.saveFitnessData(userId, healthData);
      
      return res.status(200).json(healthData);
    } catch (error) {
      console.error('Error connecting to Apple Health:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to connect to Apple Health' 
      });
    }
  });
  
  // Get plan history endpoint
  app.get('/api/plans/history', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const userId = req.user.id;
      const history = await storage.getPlanHistory(userId);
      
      if (!history || history.length === 0) {
        // Return empty array instead of 404
        return res.status(200).json([]);
      }
      
      return res.status(200).json(history);
    } catch (error) {
      console.error('Error retrieving plan history:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred retrieving plan history' 
      });
    }
  });
  
  // Apple Health OAuth callback
  app.get('/api/auth/apple-health/callback', async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid authorization code' });
      }
      
      // Process the authorization
      await handleAppleHealthCallback(code);
      
      // In a real app, this would:
      // 1. Redirect to a success page in the frontend
      // 2. Or return a token that the frontend can use
      return res.redirect('/');
    } catch (error) {
      console.error('Error in Apple Health callback:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to process Apple Health authorization' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
