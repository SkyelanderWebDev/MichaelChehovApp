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
  // Categories to combine in the PsychoPhysical card
  const combinedCategoryIds = ["expansion-contraction", "qualities-of-movement", "archetypal-gestures"];
  const combinedCategories = TOOL_CATEGORIES.filter(c => combinedCategoryIds.includes(c.id));
  
  // Get all other categories (excluding the 3 PsychoPhysical ones)
  const otherCategories = TOOL_CATEGORIES.filter(c => !combinedCategoryIds.includes(c.id));
  
  // Define specific positions for certain categories (in radians)
  const fixedPositions: Record<string, number> = {
    "psychological-gesture": -Math.PI / 2,  // 12 o'clock (top)
    "four-brothers": 0,                      // 3 o'clock (right)
    "characterization": Math.PI,             // 9 o'clock (left)
  };
  
  // Separate fixed and auto-positioned categories
  const fixedCategories = otherCategories.filter(c => fixedPositions[c.id]);
  const autoCategories = otherCategories.filter(c => !fixedPositions[c.id]);
  
  // Calculate positions for auto categories (fill remaining positions)
  // Exclude positions around 12, 3, 6, 9 o'clock to avoid fixed categories and PsychoPhysical card
  const totalAuto = autoCategories.length;
  const autoPositions: number[] = [];
  
  // Distribute auto categories evenly, avoiding the fixed positions
  // We'll place them starting from 1:30 and going clockwise
  const startAngle = -Math.PI / 2 + (Math.PI / 6); // Start at 1:30 (30 degrees from top)
  const availableArc = (2 * Math.PI) - (4 * Math.PI / 3); // Exclude areas around fixed positions
  
  for (let i = 0; i < totalAuto; i++) {
    const angle = startAngle + (i / Math.max(totalAuto - 1, 1)) * availableArc;
    autoPositions.push(angle);
  }
  
  return (
    <div className="relative w-full max-w-[750px] mx-auto">
      {/* Circular wheel section */}
      <div className="relative w-full max-w-[650px] mx-auto aspect-square">
      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-accent/20 border-3 border-accent flex items-center justify-center shadow-lg">
          <span className="text-[9px] md:text-[11px] font-bold text-center px-3 leading-tight text-accent-foreground">
            Select Tools for Inspired Action
          </span>
        </div>
      </div>
      
      {/* Render fixed position categories */}
      {fixedCategories.map((category) => {
        const angle = fixedPositions[category.id];
        const radius = 240;
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

              <button
                onClick={() => onOpenDetail(category.id)}
                data-testid={`card-category-${category.id}`}
                className={`
                  w-24 h-24 md:w-28 md:h-28
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
                  {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </button>
            </div>
          </div>
        );
      })}

      {/* Render auto-positioned categories */}
      {autoCategories.map((category, index) => {
        const angle = autoPositions[index];
        const radius = 240;
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

              <button
                onClick={() => onOpenDetail(category.id)}
                data-testid={`card-category-${category.id}`}
                className={`
                  w-24 h-24 md:w-28 md:h-28
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
                  {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </button>
            </div>
          </div>
        );
      })}
      
      {/* PsychoPhysical Gestures card at 6 o'clock */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, calc(-50% + ${240}px))`,
        }}
      >
        <div className="bg-card border-3 border-primary/30 rounded-2xl p-3 shadow-lg w-64">
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
                    {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        </div>
      </div>
      </div>
    </div>
  );
}
