import { useState } from "react";
import CategoryCard from "../CategoryCard";
import { TOOL_CATEGORIES } from "@/lib/toolData";

export default function CategoryCardExample() {
  const [selected, setSelected] = useState(false);
  
  return (
    <div className="p-8 max-w-sm">
      <CategoryCard 
        category={TOOL_CATEGORIES[0]} 
        isSelected={selected}
        onToggle={() => setSelected(!selected)}
      />
    </div>
  );
}
