import { Check } from "lucide-react";
import { ToolCategory } from "@shared/schema";
import { CATEGORY_ICONS } from "@/lib/toolData";

interface CategoryCardProps {
  category: ToolCategory;
  isSelected: boolean;
  onToggle: () => void;
}

export default function CategoryCard({ category, isSelected, onToggle }: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS["psychophysical"];
  
  return (
    <button
      onClick={onToggle}
      data-testid={`card-category-${category.id}`}
      className={`
        relative p-6 rounded-lg border-2 transition-all duration-200
        hover-elevate active-elevate-2
        ${isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-border bg-card'
        }
      `}
    >
      <div className="absolute top-4 right-4">
        <div 
          className={`
            w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
            ${isSelected 
              ? 'bg-primary border-primary' 
              : 'border-border bg-background'
            }
          `}
        >
          {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center space-y-3">
        <Icon className="w-8 h-8 text-primary" />
        <h3 className="font-semibold text-lg">{category.name}</h3>
        <p className="text-sm text-muted-foreground">
          {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
        </p>
      </div>
    </button>
  );
}
