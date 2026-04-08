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
  const combinedCategoryIds = ["expanding-contracting", "qualities-of-movement", "archetypal-gestures"];
  const combinedCategories = TOOL_CATEGORIES.filter(c => combinedCategoryIds.includes(c.id));
  
  // Get all other categories (excluding the 3 PsychoPhysical ones)
  const otherCategories = TOOL_CATEGORIES.filter(c => !combinedCategoryIds.includes(c.id));
  
  // Fixed positions for key categories at compass points
  const fixedPositionIndices: Record<string, number> = {
    "three-sisters": 0,     // 12 o'clock (top)
    "four-brothers": 3,     // 3 o'clock (right)
    "movable-centers": 6,   // 6 o'clock (bottom)
    "tempo-rhythm": 9,      // 9 o'clock (left)
  };

  // Convert indices to radians
  const totalPositions = 12;
  const angleStep = (2 * Math.PI) / totalPositions;
  const fixedPositions: Record<string, number> = {};
  Object.entries(fixedPositionIndices).forEach(([key, index]) => {
    fixedPositions[key] = -Math.PI / 2 + (index * angleStep);
  });

  // Separate fixed and auto-positioned categories
  const fixedCategories = otherCategories.filter(c => c.id in fixedPositions);
  const autoCategories = otherCategories.filter(c => !(c.id in fixedPositions));

  // Responsive radius - scales with container
  const radiusPercent = 38;

  // Calculate angles for auto categories - fill remaining positions
  const autoPositions: number[] = [];
  const reservedIndices = new Set(Object.values(fixedPositionIndices));

  // Available positions around the circle (excluding fixed ones)
  const availableIndices = Array.from({ length: totalPositions }, (_, i) => i)
    .filter(i => !reservedIndices.has(i));

  for (let i = 0; i < autoCategories.length && i < availableIndices.length; i++) {
    const index = availableIndices[i];
    const angle = -Math.PI / 2 + (index * angleStep);
    autoPositions.push(angle);
  }
  
  return (
    <div className="relative w-full max-w-[600px] md:max-w-[700px] mx-auto px-2">
      {/* Circular wheel section */}
      <div className="relative w-full mx-auto aspect-square pointer-events-none">
      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-accent/20 border-2 md:border-3 border-accent flex items-center justify-center shadow-lg">
          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-center px-2 sm:px-3 leading-tight text-foreground">
            Select Tools for Inspired Action
          </span>
        </div>
      </div>
      
      {/* Render fixed position categories */}
      {fixedCategories.map((category) => {
        const angle = fixedPositions[category.id];
        const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS["expanding-contracting"];
        const isSelected = selectedCategories.includes(category.id);
        
        const x = Math.cos(angle) * radiusPercent;
        const y = Math.sin(angle) * radiusPercent;
        
        return (
          <div
            key={category.id}
            className="absolute z-10"
            style={{
              left: `${50 + x}%`,
              top: `${50 + y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCategory(category.id);
                }}
                data-testid={`checkbox-toggle-${category.id}`}
                className="absolute -top-2 -right-2 z-20 pointer-events-auto p-2"
              >
                <div
                  className={`
                    w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                    hover:scale-110 active:scale-95
                    ${isSelected
                      ? 'bg-primary border-primary'
                      : 'border-primary/30 bg-card hover:border-primary/50'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />}
                </div>
              </button>

              <button
                onClick={() => onOpenDetail(category.id)}
                data-testid={`card-category-${category.id}`}
                className={`
                  w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 md:w-24 md:h-24
                  rounded-xl sm:rounded-2xl border-2 md:border-3 transition-all duration-300
                  hover:scale-105 active:scale-95 flex flex-col items-center justify-center p-1.5 sm:p-2 gap-0.5 sm:gap-1 pointer-events-auto
                  ${isSelected
                    ? 'border-accent bg-accent shadow-xl'
                    : 'border-primary/30 bg-card shadow-lg'
                  }
                `}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-primary/60'}`} />
                <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold text-center leading-tight line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {category.name}
                </span>
                <span className={`text-[7px] sm:text-[8px] md:text-[9px] ${isSelected ? 'text-primary/80' : 'text-muted-foreground'}`}>
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
        const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS["expanding-contracting"];
        const isSelected = selectedCategories.includes(category.id);

        const x = Math.cos(angle) * radiusPercent;
        const y = Math.sin(angle) * radiusPercent;

        return (
          <div
            key={category.id}
            className="absolute z-10"
            style={{
              left: `${50 + x}%`,
              top: `${50 + y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCategory(category.id);
                }}
                data-testid={`checkbox-toggle-${category.id}`}
                className="absolute -top-2 -right-2 z-20 pointer-events-auto p-2"
              >
                <div
                  className={`
                    w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                    hover:scale-110 active:scale-95
                    ${isSelected
                      ? 'bg-primary border-primary'
                      : 'border-primary/30 bg-card hover:border-primary/50'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />}
                </div>
              </button>

              <button
                onClick={() => onOpenDetail(category.id)}
                data-testid={`card-category-${category.id}`}
                className={`
                  w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 md:w-24 md:h-24
                  rounded-xl sm:rounded-2xl border-2 md:border-3 transition-all duration-300
                  hover:scale-105 active:scale-95 flex flex-col items-center justify-center p-1.5 sm:p-2 gap-0.5 sm:gap-1 pointer-events-auto
                  ${isSelected 
                    ? 'border-accent bg-accent shadow-xl' 
                    : 'border-primary/30 bg-card shadow-lg'
                  }
                `}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-primary/60'}`} />
                <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold text-center leading-tight line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {category.name}
                </span>
                <span className={`text-[7px] sm:text-[8px] md:text-[9px] ${isSelected ? 'text-primary/80' : 'text-muted-foreground'}`}>
                  {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </button>
            </div>
          </div>
        );
      })}
      </div>
      
      {/* PsychoPhysical Gestures card - separate section underneath */}
      <div className="flex justify-center mt-4">
        <div className="bg-card border-2 md:border-3 border-primary/30 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg w-full max-w-sm md:max-w-md">
          <h3 className="text-xs sm:text-sm font-bold text-center text-primary mb-2 md:mb-3">PsychoPhysical Gestures</h3>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {combinedCategories.map((category) => {
              const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS["expanding-contracting"];
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
                    className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 z-20"
                  >
                    <div 
                      className={`
                        w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                        hover:scale-110 active:scale-95
                        ${isSelected 
                          ? 'bg-primary border-primary' 
                          : 'border-primary/30 bg-card hover:border-primary/50'
                        }
                      `}
                    >
                      {isSelected && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
                    </div>
                  </button>

                  {/* Main card section */}
                  <button
                    onClick={() => onOpenDetail(category.id)}
                    data-testid={`card-category-${category.id}`}
                    className={`
                      w-full h-20 sm:h-22 md:h-24
                      rounded-lg md:rounded-xl border-2 transition-all duration-300
                      hover:scale-105 active:scale-95 flex flex-col items-center justify-center p-1.5 sm:p-2 gap-0.5 sm:gap-1
                      ${isSelected 
                        ? 'border-accent bg-accent shadow-xl' 
                        : 'border-primary/30 bg-background shadow-md'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-primary/60'}`} />
                    <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold text-center leading-tight line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {category.name}
                    </span>
                    <span className={`text-[7px] sm:text-[8px] md:text-[9px] ${isSelected ? 'text-primary/80' : 'text-muted-foreground'}`}>
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
  );
}
