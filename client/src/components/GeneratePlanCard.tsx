import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GeneratePlanCardProps {
  onGeneratePlan: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export default function GeneratePlanCard({ onGeneratePlan, isGenerating, disabled }: GeneratePlanCardProps) {
  return (
    <Card className="bg-white mb-6">
      <CardContent className="p-6">
        <div className="text-center py-4">
          <Button 
            onClick={onGeneratePlan}
            disabled={disabled || isGenerating}
            className="px-6 py-3 bg-primary-500 text-white hover:bg-primary-600 flex items-center mx-auto"
          >
            <span className="material-icons mr-2">auto_awesome</span>
            {isGenerating ? "Generating Your Plan..." : "Generate My Plan"}
          </Button>
          <p className="text-sm text-neutral-400 mt-3">
            Our AI will analyze your data and create a personalized fitness plan based on your goals and preferences.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
