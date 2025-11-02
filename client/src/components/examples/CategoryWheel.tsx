import { useState } from "react";
import CategoryWheel from "../CategoryWheel";

export default function CategoryWheelExample() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["expansion-contraction", "tempo-rhythm"]);
  
  const handleToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  return (
    <div className="p-8 bg-background min-h-screen flex items-center justify-center">
      <CategoryWheel
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggle}
      />
    </div>
  );
}
