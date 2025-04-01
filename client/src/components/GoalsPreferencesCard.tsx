import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPreferences } from "@/lib/types";

interface GoalsPreferencesCardProps {
  onPreferencesSaved: (data: UserPreferences) => void;
}

const preferencesSchema = z.object({
  primaryGoal: z.enum(["weight-loss", "muscle-gain", "endurance", "general-fitness", "stress-reduction"]),
  dietaryPreference: z.string(),
  availableTime: z.string(),
  fitnessLevel: z.number().min(1).max(5),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export default function GoalsPreferencesCard({ onPreferencesSaved }: GoalsPreferencesCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      primaryGoal: "weight-loss",
      dietaryPreference: "no-restrictions",
      availableTime: "30-60",
      fitnessLevel: 3,
    },
  });
  
  const onSubmit = async (values: PreferencesFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert form values to UserPreferences structure
      const userPreferences: UserPreferences = {
        goal: values.primaryGoal,
        dietary: values.dietaryPreference,
        availableTime: values.availableTime,
        fitnessLevel: values.fitnessLevel,
      };
      
      onPreferencesSaved(userPreferences);
    } catch (error) {
      console.error("Error submitting preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fitnessLevelLabels = ["Beginner", "Novice", "Intermediate", "Advanced", "Expert"];
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="primaryGoal"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-neutral-500">Primary Goal</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label 
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                          field.value === "weight-loss" ? "border-primary-500 bg-primary-50" : "hover:bg-neutral-50"
                        }`}
                      >
                        <input 
                          type="radio" 
                          className="sr-only" 
                          value="weight-loss" 
                          checked={field.value === "weight-loss"}
                          onChange={() => field.onChange("weight-loss")}
                        />
                        <span className={`material-icons text-2xl mb-2 ${
                          field.value === "weight-loss" ? "text-primary-500" : "text-neutral-400"
                        }`}>fitness_center</span>
                        <span className="font-medium">Weight Loss</span>
                      </label>
                      
                      <label 
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                          field.value === "muscle-gain" ? "border-primary-500 bg-primary-50" : "hover:bg-neutral-50"
                        }`}
                      >
                        <input 
                          type="radio" 
                          className="sr-only" 
                          value="muscle-gain" 
                          checked={field.value === "muscle-gain"}
                          onChange={() => field.onChange("muscle-gain")}
                        />
                        <span className={`material-icons text-2xl mb-2 ${
                          field.value === "muscle-gain" ? "text-primary-500" : "text-neutral-400"
                        }`}>accessibility_new</span>
                        <span className="font-medium">Muscle Gain</span>
                      </label>
                      
                      <label 
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                          field.value === "endurance" ? "border-primary-500 bg-primary-50" : "hover:bg-neutral-50"
                        }`}
                      >
                        <input 
                          type="radio" 
                          className="sr-only" 
                          value="endurance" 
                          checked={field.value === "endurance"}
                          onChange={() => field.onChange("endurance")}
                        />
                        <span className={`material-icons text-2xl mb-2 ${
                          field.value === "endurance" ? "text-primary-500" : "text-neutral-400"
                        }`}>directions_run</span>
                        <span className="font-medium">Endurance</span>
                      </label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dietaryPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-500">Dietary Preferences</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dietary preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no-restrictions">No restrictions</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="low-carb">Low-carb</SelectItem>
                        <SelectItem value="gluten-free">Gluten-free</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availableTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-500">Daily Available Time for Exercise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select available time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-15">Less than 15 minutes</SelectItem>
                        <SelectItem value="15-30">15-30 minutes</SelectItem>
                        <SelectItem value="30-60">30-60 minutes</SelectItem>
                        <SelectItem value="60+">More than 60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="fitnessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-500">Fitness Level</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                      <div className="grid grid-cols-5 w-full text-xs text-neutral-400">
                        {fitnessLevelLabels.map((label, index) => (
                          <span 
                            key={label} 
                            className={index === 0 ? '' : index === 4 ? 'text-right' : 'text-center'}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="bg-primary-500 text-white hover:bg-primary-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Preferences"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
