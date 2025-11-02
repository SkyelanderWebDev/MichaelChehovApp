import { useState } from "react";
import { DrawnTool } from "@shared/schema";
import { TOOL_CATEGORIES } from "@/lib/toolData";
import CategoryWheel from "@/components/CategoryWheel";
import DrawButton from "@/components/DrawButton";
import ToolRevealCard from "@/components/ToolRevealCard";
import HistoryPanel from "@/components/HistoryPanel";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentTool, setCurrentTool] = useState<DrawnTool | null>(null);
  const [history, setHistory] = useState<DrawnTool[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
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
      
      const randomParentTool = randomCategory.tools[
        Math.floor(Math.random() * randomCategory.tools.length)
      ];
      
      // If the parent tool has children, randomly select one
      const randomChild = randomParentTool.children && randomParentTool.children.length > 0
        ? randomParentTool.children[Math.floor(Math.random() * randomParentTool.children.length)]
        : undefined;
      
      const scaleValue = randomCategory.hasScale 
        ? Math.floor(Math.random() * 10) + 1 
        : undefined;
      
      const drawnTool: DrawnTool = {
        id: `${Date.now()}-${Math.random()}`,
        categoryId: randomCategory.id,
        categoryName: randomCategory.name,
        parentToolName: randomParentTool.name,
        childToolName: randomChild,
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
      <header className="border-b-4 border-accent bg-primary shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-white flex-1" data-testid="text-app-title">
              Actor's Toolkit
            </h1>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-center text-primary-foreground/90 text-lg">
            Randomized Technique Selector
          </p>
        </div>
      </header>
      
      <main className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className={`transition-all duration-300 ${isHistoryOpen ? 'lg:mr-96' : ''}`}>
          <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
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
        </div>
        
        {/* History drawer - desktop */}
        <div 
          className={`
            hidden lg:block fixed top-[160px] right-0 h-[calc(100vh-160px)] 
            transition-transform duration-300 ease-in-out z-40
            ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="relative h-full w-96 pr-4">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              data-testid="button-toggle-history"
              className="absolute -left-12 top-8 w-12 h-16 bg-primary hover:bg-primary/90 rounded-l-xl shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-white font-bold text-lg">
                {isHistoryOpen ? '›' : '‹'}
              </span>
            </button>
            <div className="h-full overflow-y-auto pb-8">
              <HistoryPanel 
                history={history}
                onSelectTool={handleSelectFromHistory}
              />
            </div>
          </div>
        </div>
        
        {/* History panel - mobile (always visible) */}
        <div className="lg:hidden mt-12">
          <HistoryPanel 
            history={history}
            onSelectTool={handleSelectFromHistory}
          />
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
