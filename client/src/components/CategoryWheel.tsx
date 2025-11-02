import { ToolCategory } from "@shared/schema";
import { TOOL_CATEGORIES, CATEGORY_ICONS } from "@/lib/toolData";
import { Check } from "lucide-react";

interface CategoryWheelProps {
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  onOpenDetail: (categoryId: string) => void;
}

export default function CategoryWheel({
  selectedCategories,
  onToggleCategory,
  onOpenDetail,
}: CategoryWheelProps) {
  // Categories to combine in the bottom card
  const combinedCategoryIds = ["expansion-contraction", "qualities-of-movement", "archetypal-gestures"];
  const combinedCategories = TOOL_CATEGORIES.filter(c => combinedCategoryIds.includes(c.id));
  const circularCategories = TOOL_CATEGORIES.filter(c => !combinedCategoryIds.includes(c.id));
  const totalCategories = circularCategories.length;
  
  return (
    <div className="relative w-full max-w-[900px] mx-auto">
      {/* Circular wheel section */}
      <div className="relative w-full max-w-[800px] mx-auto aspect-square mb-8">
      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent/20 border-3 border-accent flex items-center justify-center shadow-lg">
          <span className="text-xs md:text-sm font-bold text-center px-2 text-accent-foreground">
            Select Tools
          </span>
        </div>
      </div>
      
      {/* Category cards arranged in perfect circle */}
      {circularCategories.map((category, index) => {
        const angle = (index / totalCategories) * 2 * Math.PI - Math.PI / 2; // Start from top
        const radius = 300; // pixels from center - increased for better spacing
        const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS["expansion-contraction"];
        const isSelected = selectedCategories.includes(category.id);
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <div
            key={category.id}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <div className="relative">
              {/* Checkbox toggle - positioned absolutely */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCategory(category.id);
                }}
                data-testid={`checkbox-toggle-${category.id}`}
                className="absolute -top-2 -right-2 z-20"
              >
                <div 
                  className={`
                    w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                    hover:scale-110 active:scale-95
                    ${isSelected 
                      ? 'bg-primary border-primary' 
                      : 'border-primary/30 bg-card hover:border-primary/50'
                    }
                  `}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>

              {/* Main card - clickable to open details */}
              <button
                onClick={() => onOpenDetail(category.id)}
                data-testid={`card-category-${category.id}`}
                className={`
                  w-20 h-20 md:w-28 md:h-28
                  rounded-2xl border-3 transition-all duration-300
                  hover:scale-105 active:scale-95 flex flex-col items-center justify-center p-2 gap-1
                  ${isSelected 
                    ? 'border-accent bg-accent shadow-xl' 
                    : 'border-primary/30 bg-card shadow-lg'
                  }
                `}
              >
                <Icon className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-primary/60'}`} />
                <span className={`text-[10px] md:text-xs font-bold text-center leading-tight line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {category.name}
                </span>
                <span className={`text-[9px] md:text-[10px] mt-0.5 ${isSelected ? 'text-primary/80' : 'text-muted-foreground'}`}>
                  {category.tools.length} {category.tools.length === 1 ? 'parent' : 'parents'}
                </span>
              </button>
            </div>
          </div>
        );
      })}
      </div>

      {/* Combined rectangular card at the bottom */}
      <div className="w-full max-w-[800px] mx-auto mt-8">
      <div className="bg-card border-3 border-primary/30 rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-bold text-center text-primary mb-3">PsychoPhysical Gestures</h3>
        <div className="grid grid-cols-3 gap-3">
          {combinedCategories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS["expansion-contraction"];
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <div key={category.id} className="relative">
                {/* Checkbox toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCategory(category.id);
                  }}
                  data-testid={`checkbox-toggle-${category.id}`}
                  className="absolute -top-2 -right-2 z-20"
                >
                  <div 
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                      hover:scale-110 active:scale-95
                      ${isSelected 
                        ? 'bg-primary border-primary' 
                        : 'border-primary/30 bg-card hover:border-primary/50'
                      }
                    `}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>

                {/* Main card section */}
                <button
                  onClick={() => onOpenDetail(category.id)}
                  data-testid={`card-category-${category.id}`}
                  className={`
                    w-full h-24 md:h-28
                    rounded-xl border-2 transition-all duration-300
                    hover:scale-105 active:scale-95 flex flex-col items-center justify-center p-2 gap-1
                    ${isSelected 
                      ? 'border-accent bg-accent shadow-xl' 
                      : 'border-primary/30 bg-background shadow-md'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 md:w-7 md:h-7 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-primary/60'}`} />
                  <span className={`text-[10px] md:text-xs font-bold text-center leading-tight line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {category.name}
                  </span>
                  <span className={`text-[9px] md:text-[10px] ${isSelected ? 'text-primary/80' : 'text-muted-foreground'}`}>
                    {category.tools.length} {category.tools.length === 1 ? 'parent' : 'parents'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
