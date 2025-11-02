import { ToolCategory } from "@shared/schema";
import { TOOL_CATEGORIES } from "@/lib/toolData";
import CategoryCard from "./CategoryCard";
import { Button } from "@/components/ui/button";

interface CategorySelectorProps {
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export default function CategorySelector({
  selectedCategories,
  onToggleCategory,
  onSelectAll,
  onClearAll,
}: CategorySelectorProps) {
  const allSelected = selectedCategories.length === TOOL_CATEGORIES.length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select Categories</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            data-testid="button-select-all"
            disabled={allSelected}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            data-testid="button-clear-all"
            disabled={selectedCategories.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOL_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategories.includes(category.id)}
            onToggle={() => onToggleCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
