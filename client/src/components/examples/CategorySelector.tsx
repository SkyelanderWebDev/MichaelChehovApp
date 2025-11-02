import { useState } from "react";
import CategorySelector from "../CategorySelector";

export default function CategorySelectorExample() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["psychophysical"]);
  
  const handleToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleSelectAll = () => {
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
