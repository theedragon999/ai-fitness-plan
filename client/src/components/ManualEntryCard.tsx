import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FitnessData } from "@/lib/types";

interface ManualEntryCardProps {
  onDataSaved: (data: FitnessData) => void;
}

const manualEntrySchema = z.object({
  avgSteps: z.coerce.number().min(0, "Must be a positive number").max(100000, "Value too high"),
  avgCaloriesBurned: z.coerce.number().min(0, "Must be a positive number").max(10000, "Value too high"),
  weeklyWorkoutMinutes: z.coerce.number().min(0, "Must be a positive number").max(10080, "Cannot exceed minutes in a week"),
});

type ManualEntryFormValues = z.infer<typeof manualEntrySchema>;

export default function ManualEntryCard({ onDataSaved }: ManualEntryCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ManualEntryFormValues>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      avgSteps: 0,
      avgCaloriesBurned: 0,
      weeklyWorkoutMinutes: 0,
    },
  });
  
  const onSubmit = async (values: ManualEntryFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert form values to FitnessData structure
      const fitnessData: FitnessData = {
        source: "manual",
        dailyAverage: {
          steps: values.avgSteps,
          caloriesBurned: values.avgCaloriesBurned,
        },
        weeklyTotal: {
          workoutMinutes: values.weeklyWorkoutMinutes,
        },
        activityLevel: calculateActivityLevel(values.avgSteps, values.weeklyWorkoutMinutes),
      };
      
      onDataSaved(fitnessData);
    } catch (error) {
      console.error("Error submitting manual data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Simple function to calculate activity level based on steps and workout minutes
  const calculateActivityLevel = (steps: number, workoutMinutes: number): string => {
    const score = (steps / 10000) + (workoutMinutes / 150);
    if (score < 0.5) return "Sedentary";
    if (score < 1) return "Lightly Active";
    if (score < 1.5) return "Moderately Active";
    if (score < 2) return "Very Active";
    return "Extremely Active";
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <span className="material-icons text-primary-500 mr-2">edit</span>
          <h4 className="font-medium">Manual Data Entry</h4>
        </div>
        <p className="text-sm text-neutral-400 mb-4">
          Enter your fitness data manually if you don't have a CSV file.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="avgSteps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-500">Average Daily Steps</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 8000"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avgCaloriesBurned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-500">Average Daily Calories Burned</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 2200"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="weeklyWorkoutMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-500">Weekly Workout Minutes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 150"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-primary-500 text-white hover:bg-primary-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Data"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
