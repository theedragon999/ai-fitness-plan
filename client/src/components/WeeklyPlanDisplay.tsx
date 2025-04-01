import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FitnessPlan, DayPlan } from "@/lib/types";
import DayPlanCard from "@/components/DayPlanCard";
import { toast } from "@/hooks/use-toast";

interface WeeklyPlanDisplayProps {
  isLoading: boolean;
}

export default function WeeklyPlanDisplay({ isLoading }: WeeklyPlanDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>("monday");
  
  const { data: plan, isLoading: isPlanLoading } = useQuery<FitnessPlan>({
    queryKey: ['/api/plans/current'],
  });
  
  const loading = isLoading || isPlanLoading;
  
  const toggleDayExpand = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };
  
  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "PDF Export",
      description: "This feature would export your plan to a PDF file.",
    });
  };
  
  const handleSharePlan = () => {
    // In a real implementation, this would share the plan
    toast({
      title: "Share Plan", 
      description: "This feature would allow you to share your plan via email or link.",
    });
  };
  
  const handlePrintPlan = () => {
    window.print();
  };
  
  // Days of the week for display
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-medium flex items-center">
            <span className="material-icons text-primary-500 mr-2">calendar_today</span>
            Your 7-Day Fitness Plan
          </h4>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownloadPDF}
              className="text-neutral-400 hover:text-primary-500 hover:bg-neutral-50"
              title="Download as PDF"
            >
              <span className="material-icons">download</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSharePlan}
              className="text-neutral-400 hover:text-primary-500 hover:bg-neutral-50"
              title="Share plan"
            >
              <span className="material-icons">share</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrintPlan}
              className="text-neutral-400 hover:text-primary-500 hover:bg-neutral-50"
              title="Print plan"
            >
              <span className="material-icons">print</span>
            </Button>
          </div>
        </div>
        
        {loading ? (
          // Loading skeleton for the plan
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-neutral-50">
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Actual plan content
          <div className="space-y-4">
            {days.map((day, index) => (
              <DayPlanCard
                key={day}
                day={day}
                dayPlan={plan?.days[day] as DayPlan}
                isExpanded={expandedDay === day}
                onToggle={() => toggleDayExpand(day)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
