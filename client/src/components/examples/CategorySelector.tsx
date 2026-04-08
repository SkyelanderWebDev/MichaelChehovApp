import { useState } from "react";
import CategorySelector from "../CategorySelector";

export default function CategorySelectorExample() {
  // TODO(claude): "psychophysical" is not a valid category ID. Use a real ID from toolData.ts (e.g. "expanding-contracting")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["psychophysical"]);
  
  const handleToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleSelectAll = () => {
    // TODO(claude): "psychophysical", "characterization", and "tpt" are not valid category IDs. Replace with real IDs from toolData.ts.
    setSelectedCategories(["psychophysical", "characterization", "tempo-rhythm", "four-brothers", "three-sisters", "qualities-sensations", "tpt"]);
  };
  
  const handleClearAll = () => {
    setSelectedCategories([]);
  };
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <CategorySelector
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggle}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
