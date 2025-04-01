import { DayPlan } from "@/lib/types";

interface DayPlanCardProps {
  day: string;
  dayPlan: DayPlan;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function DayPlanCard({ day, dayPlan, isExpanded, onToggle }: DayPlanCardProps) {
  // If no plan data is available yet
  if (!dayPlan) {
    return (
      <div className="border rounded-lg mb-4 overflow-hidden">
        <button
          className="w-full flex justify-between items-center p-4 text-left bg-neutral-50 hover:bg-neutral-100"
          onClick={onToggle}
        >
          <div className="flex items-center">
            <span className="material-icons text-primary-500 mr-3">today</span>
            <span className="font-medium capitalize">{day}</span>
          </div>
          <span className="material-icons">
            {isExpanded ? "expand_less" : "expand_more"}
          </span>
        </button>
        
        {isExpanded && (
          <div className="p-4 text-center text-neutral-400">
            No plan available for this day yet.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded-lg mb-4 overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 text-left bg-neutral-50 hover:bg-neutral-100"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <span className="material-icons text-primary-500 mr-3">today</span>
          <span className="font-medium capitalize">{day}</span>
        </div>
        <span className="material-icons">
          {isExpanded ? "expand_less" : "expand_more"}
        </span>
      </button>
      
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-3 flex items-center">
                <span className="material-icons text-green-500 mr-2">fitness_center</span>
                Workout Plan
              </h5>
              
              <ul className="space-y-3">
                {dayPlan.workout.map((exercise, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-icons text-green-500 mr-2 text-sm mt-0.5">radio_button_unchecked</span>
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-neutral-400">{exercise.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-3 flex items-center">
                <span className="material-icons text-orange-500 mr-2">restaurant</span>
                Nutrition Plan
              </h5>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Macros Target</p>
                  <div className="flex space-x-4 text-sm text-neutral-500">
                    <span>Protein: {dayPlan.nutrition.macros.protein}g</span>
                    <span>Carbs: {dayPlan.nutrition.macros.carbs}g</span>
                    <span>Fat: {dayPlan.nutrition.macros.fat}g</span>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium">Meal Ideas</p>
                  <ul className="text-sm text-neutral-500 space-y-1">
                    {dayPlan.nutrition.meals.map((meal, index) => (
                      <li key={index}>{meal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-primary-50 rounded-md">
            <h5 className="font-medium mb-1 flex items-center">
              <span className="material-icons text-primary-500 mr-2">emoji_objects</span>
              Today's Tip
            </h5>
            <p className="text-sm text-neutral-500">{dayPlan.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}
