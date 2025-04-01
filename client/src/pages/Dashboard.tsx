import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import CsvUploadCard from "@/components/CsvUploadCard";
import ManualEntryCard from "@/components/ManualEntryCard";
import AppleHealthConnect from "@/components/AppleHealthConnect";
import GoalsPreferencesCard from "@/components/GoalsPreferencesCard";
import GeneratePlanCard from "@/components/GeneratePlanCard";
import DataAnalysisSummary from "@/components/DataAnalysisSummary";
import WeeklyPlanDisplay from "@/components/WeeklyPlanDisplay";
import ProgressChartCard from "@/components/ProgressChartCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FitnessData, UserPreferences, FitnessPlan, DataSummary } from "@/lib/types";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const [userName, setUserName] = useState("User");
  const [fitnessData, setFitnessData] = useState<FitnessData | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [location] = useLocation();

  // Define the type for user profile
  interface UserProfile {
    id: number;
    name: string;
  }

  // Fetch user profile info if available
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['/api/profile']
  });

  // Update username when profile data is fetched
  useEffect(() => {
    if (userProfile && userProfile.name) {
      setUserName(userProfile.name);
    }
  }, [userProfile]);

  // Fetch current plan if available
  const { data: currentPlan } = useQuery({
    queryKey: ['/api/plans/current']
  });

  // Save fitness data
  const saveFitnessDataMutation = useMutation({
    mutationFn: async (data: FitnessData) => {
      const response = await apiRequest('POST', '/api/fitness-data', data);
      return await response.json();
    },
    onSuccess: (data) => {
      setFitnessData(data);
      toast({
        title: "Data saved successfully",
        description: "Your fitness data has been uploaded and processed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving data",
        description: error.message || "There was an error saving your fitness data. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Save user preferences
  const savePreferencesMutation = useMutation({
    mutationFn: async (data: UserPreferences) => {
      const response = await apiRequest('POST', '/api/preferences', data);
      return await response.json();
    },
    onSuccess: (data) => {
      setPreferences(data);
      toast({
        title: "Preferences saved successfully",
        description: "Your goals and preferences have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving preferences",
        description: error.message || "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Generate AI plan
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/generate-plan', {});
      return await response.json();
    },
    onSuccess: (data) => {
      setShowSummary(true);
      setShowPlan(true);
      queryClient.invalidateQueries({ queryKey: ['/api/plans/current'] });
      toast({
        title: "Plan generated successfully",
        description: "Your personalized fitness plan is ready to view.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error generating plan",
        description: error.message || "There was an error generating your fitness plan. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Function to handle fitness data saving
  const handleSaveFitnessData = (data: FitnessData) => {
    saveFitnessDataMutation.mutate(data);
  };

  // Function to handle preferences saving
  const handleSavePreferences = (data: UserPreferences) => {
    savePreferencesMutation.mutate(data);
  };

  // Function to handle plan generation
  const handleGeneratePlan = () => {
    if (!fitnessData) {
      toast({
        title: "Missing fitness data",
        description: "Please upload your fitness data or enter it manually before generating a plan.",
        variant: "destructive",
      });
      return;
    }

    if (!preferences) {
      toast({
        title: "Missing preferences",
        description: "Please set your goals and preferences before generating a plan.",
        variant: "destructive",
      });
      return;
    }

    generatePlanMutation.mutate();
  };

  // Helper function to render content based on route
  const renderContent = () => {
    // For workout plans page
    if (location === "/workouts") {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-500 mb-2">Workout Plans</h2>
            <p className="text-neutral-400">Your personalized workout routines.</p>
          </div>
          <div className="mb-8">
            {showPlan ? (
              <WeeklyPlanDisplay isLoading={false} />
            ) : (
              <div className="p-6 bg-white shadow rounded-lg">
                <p className="text-center mb-4">You haven't generated a workout plan yet.</p>
                <GeneratePlanCard 
                  onGeneratePlan={handleGeneratePlan}
                  isGenerating={generatePlanMutation.isPending}
                  disabled={!fitnessData || !preferences} 
                />
              </div>
            )}
          </div>
        </>
      );
    }
    
    // For meal plans page
    if (location === "/meals") {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-500 mb-2">Meal Plans</h2>
            <p className="text-neutral-400">Your personalized nutrition recommendations.</p>
          </div>
          <div className="mb-8">
            {showPlan ? (
              <WeeklyPlanDisplay isLoading={false} />
            ) : (
              <div className="p-6 bg-white shadow rounded-lg">
                <p className="text-center mb-4">You haven't generated a meal plan yet.</p>
                <GeneratePlanCard 
                  onGeneratePlan={handleGeneratePlan}
                  isGenerating={generatePlanMutation.isPending}
                  disabled={!fitnessData || !preferences} 
                />
              </div>
            )}
          </div>
        </>
      );
    }
    
    // For progress page
    if (location === "/progress") {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-500 mb-2">Your Progress</h2>
            <p className="text-neutral-400">Track your fitness journey over time.</p>
          </div>
          <div className="mb-8">
            <ProgressChartCard />
          </div>
          {showSummary && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-neutral-500 mb-4">Data Analysis</h3>
              <DataAnalysisSummary isLoading={false} />
            </div>
          )}
        </>
      );
    }
    
    // For history page
    if (location === "/history") {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-500 mb-2">Your History</h2>
            <p className="text-neutral-400">View your past workouts and achievements.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <p>Your historical fitness data will appear here.</p>
          </div>
        </>
      );
    }
    
    // For profile page
    if (location === "/profile") {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-500 mb-2">Your Profile</h2>
            <p className="text-neutral-400">Manage your account and preferences.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg mb-8">
            <p className="font-medium mb-2">Name: {userName}</p>
            <p className="font-medium mb-4">Account ID: {userProfile?.id}</p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-500 mb-4">Your Preferences</h3>
            <GoalsPreferencesCard onPreferencesSaved={handleSavePreferences} />
          </div>
        </>
      );
    }
    
    // Default dashboard page
    return (
      <>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-neutral-500 mb-2">
            Welcome back, {userName}!
          </h2>
          <p className="text-neutral-400">
            Let's create your personalized fitness plan based on your data and goals.
          </p>
        </div>

        {/* Data Import Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-500">Import Your Fitness Data</h3>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                Step 1 of 3
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AppleHealthConnect onDataReceived={handleSaveFitnessData} />
            <CsvUploadCard onDataSaved={handleSaveFitnessData} />
            <ManualEntryCard onDataSaved={handleSaveFitnessData} />
          </div>
        </section>

        {/* Goals & Preferences Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-500">Set Your Goals & Preferences</h3>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                Step 2 of 3
              </span>
            </div>
          </div>
          
          <GoalsPreferencesCard onPreferencesSaved={handleSavePreferences} />
        </section>

        {/* Generated Plan Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-500">Your Personalized Fitness Plan</h3>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                Step 3 of 3
              </span>
            </div>
          </div>
          
          <GeneratePlanCard 
            onGeneratePlan={handleGeneratePlan}
            isGenerating={generatePlanMutation.isPending}
            disabled={!fitnessData || !preferences || generatePlanMutation.isPending} 
          />
          
          {showSummary && (
            <DataAnalysisSummary 
              isLoading={generatePlanMutation.isPending} 
            />
          )}
          
          {showPlan && (
            <WeeklyPlanDisplay 
              isLoading={generatePlanMutation.isPending} 
            />
          )}
        </section>

        {/* Progress Chart Section */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-500 mb-4">Your Progress</h3>
          <ProgressChartCard />
        </section>
      </>
    );
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
}
