import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { DataSummary } from "@/lib/types";

interface DataAnalysisSummaryProps {
  isLoading: boolean;
}

export default function DataAnalysisSummary({ isLoading }: DataAnalysisSummaryProps) {
  const { data: summary, isLoading: isSummaryLoading } = useQuery<DataSummary>({
    queryKey: ['/api/summary'],
  });
  
  const loading = isLoading || isSummaryLoading;

  return (
    <Card className="bg-white mb-6">
      <CardContent className="p-6">
        <h4 className="font-medium mb-4 flex items-center">
          <span className="material-icons text-primary-500 mr-2">analytics</span>
          Data Analysis Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-neutral-400">Daily Steps Average</p>
            <div className="flex items-end mt-1">
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <span className="text-2xl font-mono font-medium">
                    {summary?.stats.avgSteps.toLocaleString() || '0'}
                  </span>
                  {summary?.stats.stepsChange && (
                    <span className={`text-xs ml-2 mb-1 flex items-center ${
                      summary.stats.stepsChange > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      <span className="material-icons text-xs mr-0.5">
                        {summary.stats.stepsChange > 0 ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                      {Math.abs(summary.stats.stepsChange)}% vs. last week
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <p className="text-sm text-neutral-400">Activity Level</p>
            <div className="flex items-end mt-1">
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <span className="text-2xl font-medium">
                  {summary?.stats.activityLevel || 'Not enough data'}
                </span>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <p className="text-sm text-neutral-400">Weekly Active Minutes</p>
            <div className="flex items-end mt-1">
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <span className="text-2xl font-mono font-medium">
                    {summary?.stats.activeMinutes.toLocaleString() || '0'}
                  </span>
                  {summary?.stats.minutesChange && (
                    <span className={`text-xs ml-2 mb-1 flex items-center ${
                      summary.stats.minutesChange > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      <span className="material-icons text-xs mr-0.5">
                        {summary.stats.minutesChange > 0 ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                      {Math.abs(summary.stats.minutesChange)}% vs. last week
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-50 p-4 rounded-lg">
          <h5 className="font-medium mb-2">AI Summary</h5>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              {summary?.text || 'No summary available yet. Please generate a plan to see your data analysis.'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
