import { useState } from "react";
import { DrawnTool } from "@shared/schema";
import { TOOL_CATEGORIES } from "@/lib/toolData";
import CategoryWheel from "@/components/CategoryWheel";
import DrawButton from "@/components/DrawButton";
import ToolRevealCard from "@/components/ToolRevealCard";
import HistoryPanel from "@/components/HistoryPanel";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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
  
  const allSelected = selectedCategories.length === TOOL_CATEGORIES.length;
  
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
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-accent bg-primary shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white" data-testid="text-app-title">
            Actor's Toolkit
          </h1>
          <p className="text-center text-primary-foreground/90 mt-3 text-lg">
            Randomized Technique Selector
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center space-y-8">
            {/* Quick actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={handleSelectAll}
                data-testid="button-select-all"
                disabled={allSelected}
                className="border-2 border-primary/30 hover:border-accent hover:bg-accent/10 font-semibold"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={handleClearAll}
                data-testid="button-clear-all"
                disabled={selectedCategories.length === 0}
                className="border-2 border-primary/30 hover:border-accent hover:bg-accent/10 font-semibold"
              >
                Clear All
              </Button>
            </div>
            
            {/* Wheel */}
            <div className="w-full max-w-3xl py-12">
              <CategoryWheel
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
              />
            </div>
            
            {/* Draw button */}
            <div className="flex justify-center pt-8">
              <DrawButton
                onClick={handleDrawTool}
                disabled={selectedCategories.length === 0}
                isDrawing={isDrawing}
              />
            </div>
          </div>
          
          <div className="lg:w-96 shrink-0">
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
