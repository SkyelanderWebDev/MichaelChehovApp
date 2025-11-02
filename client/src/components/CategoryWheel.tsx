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
    <div className="relative w-full max-w-[600px] mx-auto aspect-square">
      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent/20 border-3 border-accent flex items-center justify-center shadow-lg">
          <span className="text-xs md:text-sm font-bold text-center px-2 text-accent-foreground">
            Select Tools
          </span>
        </div>
      </div>
      
      {/* Category cards arranged in perfect circle */}
      {TOOL_CATEGORIES.map((category, index) => {
        const angle = (index / totalCategories) * 2 * Math.PI - Math.PI / 2; // Start from top
        const radius = 240; // pixels from center
        const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS["expansion-contraction"];
        const isSelected = selectedCategories.includes(category.id);
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <button
            key={category.id}
            onClick={() => onToggleCategory(category.id)}
            data-testid={`card-category-${category.id}`}
            className={`
              absolute w-24 h-24 md:w-32 md:h-32
              rounded-2xl border-3 transition-all duration-300
              hover:scale-105 active:scale-95 flex flex-col items-center justify-center p-2 gap-1
              ${isSelected 
                ? 'border-accent bg-accent shadow-xl' 
                : 'border-primary/30 bg-white shadow-lg'
              }
            `}
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <div className="absolute -top-2 -right-2 z-10">
              <div 
                className={`
                  w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                  ${isSelected 
                    ? 'bg-primary border-primary' 
                    : 'border-primary/30 bg-white'
                  }
                `}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            
            <Icon className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-primary/60'}`} />
            <span className={`text-[10px] md:text-xs font-bold text-center leading-tight line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
              {category.name}
            </span>
            <span className={`text-[9px] md:text-[10px] mt-0.5 ${isSelected ? 'text-primary/80' : 'text-muted-foreground'}`}>
              {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
