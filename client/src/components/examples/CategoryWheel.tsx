import { useState } from "react";
import CategoryWheel from "../CategoryWheel";

export default function CategoryWheelExample() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["expanding-contracting", "tempo-rhythm"]);
  
  const handleToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // TODO(claude): CategoryWheel now requires an "onOpenDetail" prop — add it here
  return (
    <div className="p-8 bg-background min-h-screen flex items-center justify-center">
      <CategoryWheel
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggle}
      />
    </div>
  );
}
