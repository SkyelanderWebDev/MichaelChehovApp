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
    <div className="relative w-full max-w-[600px] mx-auto" style={{ paddingBottom: '100%' }}>
      <div className="absolute inset-0">
        {/* Center hub */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center z-10">
            <span className="text-xs md:text-sm font-semibold text-center px-2 text-primary">
              Select Tools
            </span>
          </div>
        </div>
        
        {/* Category cards arranged in circle */}
        {TOOL_CATEGORIES.map((category, index) => {
          const angle = (index / totalCategories) * 360 - 90; // Start from top
          const radiusX = 42; // horizontal radius percentage
          const radiusY = 42; // vertical radius percentage
          const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS["expansion-contraction"];
          const isSelected = selectedCategories.includes(category.id);
          
          const x = 50 + radiusX * Math.cos((angle * Math.PI) / 180);
          const y = 50 + radiusY * Math.sin((angle * Math.PI) / 180);
          
          return (
            <button
              key={category.id}
              onClick={() => onToggleCategory(category.id)}
              data-testid={`card-category-${category.id}`}
              className={`
                absolute w-24 h-24 md:w-32 md:h-32 -ml-12 -mt-12 md:-ml-16 md:-mt-16
                rounded-xl border-2 transition-all duration-200
                hover-elevate active-elevate-2 flex flex-col items-center justify-center p-2
                ${isSelected 
                  ? 'border-primary bg-primary/10 shadow-lg' 
                  : 'border-border bg-card shadow'
                }
              `}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              <div className="absolute -top-2 -right-2 z-10">
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
              
              <Icon className={`w-5 h-5 md:w-7 md:h-7 mb-1 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-foreground'}`} />
              <span className="text-[10px] md:text-xs font-semibold text-center leading-tight line-clamp-2">
                {category.name}
              </span>
              <span className="text-[9px] md:text-xs text-muted-foreground mt-0.5">
                {category.tools.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
