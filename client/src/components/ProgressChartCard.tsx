import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type ChartPeriod = 'week' | 'month' | 'year';
type ChartType = 'steps' | 'workouts' | 'weight';

export default function ProgressChartCard() {
  const [chartType, setChartType] = useState<ChartType>('steps');
  const [period, setPeriod] = useState<ChartPeriod>('month');
  
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['/api/progress', chartType, period],
  });
  
  // Chart data mapping
  const chartLabels = {
    week: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    month: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
    year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };
  
  // Placeholder data for demonstration
  const mockStats = {
    currentAvg: chartType === 'steps' ? 7234 : chartType === 'workouts' ? 5 : 158,
    goal: chartType === 'steps' ? 8000 : chartType === 'workouts' ? 7 : 150,
    unit: chartType === 'steps' ? 'steps' : chartType === 'workouts' ? 'sessions/week' : 'lbs',
    progress: 90.4,
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <Button
              variant={chartType === 'steps' ? 'default' : 'outline'}
              className={`rounded-l-lg ${chartType === 'steps' ? 'bg-primary-500 text-white' : ''}`}
              onClick={() => setChartType('steps')}
            >
              Steps
            </Button>
            <Button
              variant={chartType === 'workouts' ? 'default' : 'outline'}
              className={`rounded-none ${chartType === 'workouts' ? 'bg-primary-500 text-white' : ''}`}
              onClick={() => setChartType('workouts')}
            >
              Workouts
            </Button>
            <Button
              variant={chartType === 'weight' ? 'default' : 'outline'}
              className={`rounded-r-lg ${chartType === 'weight' ? 'bg-primary-500 text-white' : ''}`}
              onClick={() => setChartType('weight')}
            >
              Weight
            </Button>
          </div>
          
          <div className="inline-flex rounded-md shadow-sm">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              className={`rounded-l-lg ${period === 'week' ? 'bg-primary-500 text-white' : ''}`}
              onClick={() => setPeriod('week')}
            >
              Week
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              className={`rounded-none ${period === 'month' ? 'bg-primary-500 text-white' : ''}`}
              onClick={() => setPeriod('month')}
            >
              Month
            </Button>
            <Button
              variant={period === 'year' ? 'default' : 'outline'}
              className={`rounded-r-lg ${period === 'year' ? 'bg-primary-500 text-white' : ''}`}
              onClick={() => setPeriod('year')}
            >
              Year
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <Skeleton className="w-full h-64 rounded-lg" />
        ) : (
          <div className="w-full h-64 bg-neutral-50 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="w-full px-4">
                <div className="relative h-60">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-neutral-400">
                    <span>10k</span>
                    <span>8k</span>
                    <span>6k</span>
                    <span>4k</span>
                    <span>2k</span>
                    <span>0</span>
                  </div>
                  
                  {/* Chart area with mock bars */}
                  <div className="absolute left-12 right-0 top-0 bottom-0 flex items-end justify-between">
                    {chartLabels[period].slice(0, 7).map((label, index) => (
                      <div key={index} className="flex flex-col items-center w-8">
                        <div 
                          className={`w-6 ${
                            index === 5 ? 'bg-primary-700' : 'bg-primary-400'
                          } rounded-t-sm`} 
                          style={{ height: `${[30, 50, 70, 45, 60, 80, 40][index % 7]}%` }}
                        ></div>
                        <span className="text-xs text-neutral-400 mt-1">{label}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Horizontal grid lines */}
                  <div className="absolute left-10 right-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="border-b border-neutral-200 w-full h-0"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-neutral-400">Daily Average</p>
            <p className="text-xl font-mono font-medium">
              {mockStats.currentAvg.toLocaleString()} {mockStats.unit}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-neutral-400">Weekly Goal</p>
            <p className="text-xl font-mono font-medium">
              {mockStats.goal.toLocaleString()} {chartType === 'steps' ? `${mockStats.unit}/day` : mockStats.unit}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-neutral-400">Progress</p>
            <p className="text-xl font-mono font-medium text-green-500">{mockStats.progress}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
