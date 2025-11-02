import { ToolCategory } from "@shared/schema";
import { TOOL_CATEGORIES, CATEGORY_ICONS } from "@/lib/toolData";
import { Check } from "lucide-react";

interface CategoryWheelProps {
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
}

export default function CategoryWheel({
  selectedCategories,
  onToggleCategory,
}: CategoryWheelProps) {
  const totalCategories = TOOL_CATEGORIES.length;
  
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square flex items-center justify-center">
      {/* Center hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <span className="text-xs md:text-sm font-semibold text-center px-2 text-primary">
            Select Tools
          </span>
        </div>
      </div>
      
      {/* Category cards arranged in circle */}
      {TOOL_CATEGORIES.map((category, index) => {
        const angle = (index / totalCategories) * 360;
        const radius = 45; // percentage from center
        const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS["expansion-contraction"];
        const isSelected = selectedCategories.includes(category.id);
        
        return (
          <button
            key={category.id}
            onClick={() => onToggleCategory(category.id)}
            data-testid={`card-category-${category.id}`}
            className={`
              absolute w-28 h-28 md:w-36 md:h-36 rounded-xl border-2 transition-all duration-200
              hover-elevate active-elevate-2 flex flex-col items-center justify-center
              ${isSelected 
                ? 'border-primary bg-primary/10 shadow-lg' 
                : 'border-border bg-card shadow'
              }
            `}
            style={{
              left: `calc(50% + ${radius * Math.cos((angle - 90) * Math.PI / 180)}% - 3.5rem)`,
              top: `calc(50% + ${radius * Math.sin((angle - 90) * Math.PI / 180)}% - 3.5rem)`,
            }}
          >
            <div className="absolute -top-2 -right-2">
              <div 
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected 
                    ? 'bg-primary border-primary' 
                    : 'border-border bg-background'
                  }
                `}
              >
                {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
            
            <Icon className={`w-6 h-6 md:w-8 md:h-8 mb-2 ${isSelected ? 'text-primary' : 'text-foreground'}`} />
            <span className="text-xs md:text-sm font-semibold text-center px-2 leading-tight">
              {category.name}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {category.tools.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
