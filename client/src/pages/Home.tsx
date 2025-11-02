import { useState } from "react";
import { DrawnTool } from "@shared/schema";
import { TOOL_CATEGORIES } from "@/lib/toolData";
import CategorySelector from "@/components/CategorySelector";
import DrawButton from "@/components/DrawButton";
import ToolRevealCard from "@/components/ToolRevealCard";
import HistoryPanel from "@/components/HistoryPanel";
import { useToast } from "@/hooks/use-toast";
import { randomUUID } from "crypto";

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentTool, setCurrentTool] = useState<DrawnTool | null>(null);
  const [history, setHistory] = useState<DrawnTool[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();
  
  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleSelectAll = () => {
    setSelectedCategories(TOOL_CATEGORIES.map(c => c.id));
  };
  
  const handleClearAll = () => {
    setSelectedCategories([]);
  };
  
  const handleDrawTool = () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "No categories selected",
        description: "Please select at least one category to draw from.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDrawing(true);
    
    setTimeout(() => {
      const selectedCategoryObjects = TOOL_CATEGORIES.filter(c => 
        selectedCategories.includes(c.id)
      );
      
      const randomCategory = selectedCategoryObjects[
        Math.floor(Math.random() * selectedCategoryObjects.length)
      ];
      
      const randomTool = randomCategory.tools[
        Math.floor(Math.random() * randomCategory.tools.length)
      ];
      
      const scaleValue = randomCategory.hasScale 
        ? Math.floor(Math.random() * 10) + 1 
        : undefined;
      
      const drawnTool: DrawnTool = {
        id: `${Date.now()}-${Math.random()}`,
        categoryId: randomCategory.id,
        categoryName: randomCategory.name,
        toolName: randomTool,
        scaleValue,
        timestamp: Date.now(),
      };
      
      setCurrentTool(drawnTool);
      setHistory(prev => [drawnTool, ...prev].slice(0, 10));
      setIsDrawing(false);
    }, 800);
  };
  
  const handleDrawAgain = () => {
    setCurrentTool(null);
    setTimeout(() => handleDrawTool(), 100);
  };
  
  const handleClose = () => {
    setCurrentTool(null);
  };
  
  const handleSelectFromHistory = (tool: DrawnTool) => {
    setCurrentTool(tool);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center" data-testid="text-app-title">
            Actor's Toolkit
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Randomized Technique Selector
          </p>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CategorySelector
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
            
            <div className="flex justify-center">
              <DrawButton
                onClick={handleDrawTool}
                disabled={selectedCategories.length === 0}
                isDrawing={isDrawing}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <HistoryPanel 
              history={history}
              onSelectTool={handleSelectFromHistory}
            />
          </div>
        </div>
      </main>
      
      {currentTool && (
        <ToolRevealCard
          drawnTool={currentTool}
          onDrawAgain={handleDrawAgain}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
