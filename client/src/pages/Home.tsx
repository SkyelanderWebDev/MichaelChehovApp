import { useState } from "react";
import { DrawnTool } from "@shared/schema";
import { TOOL_CATEGORIES } from "@/lib/toolData";
import CategoryWheel from "@/components/CategoryWheel";
import DrawButton from "@/components/DrawButton";
import ToolRevealCard from "@/components/ToolRevealCard";
import HistoryPanel from "@/components/HistoryPanel";
import CategoryDetailModal from "@/components/CategoryDetailModal";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type HierarchyLevel = "cards" | "tools" | "examples";

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Track selected parent tools per category: { categoryId: [parentToolName1, parentToolName2, ...] }
  const [selectedParentTools, setSelectedParentTools] = useState<Record<string, string[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<DrawnTool | null>(null);
  const [history, setHistory] = useState<DrawnTool[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [selectedLevels, setSelectedLevels] = useState<HierarchyLevel[]>(["cards", "tools", "examples"]);
  const [isUnveiledEnabled, setIsUnveiledEnabled] = useState(false);
  const { toast } = useToast();
  
  const toggleLevel = (level: HierarchyLevel) => {
    setSelectedLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };
  
  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    
    // When selecting a category, auto-select all parent tools if none selected
    if (!selectedCategories.includes(categoryId)) {
      const category = TOOL_CATEGORIES.find(c => c.id === categoryId);
      if (category && !selectedParentTools[categoryId]) {
        setSelectedParentTools(prev => ({
          ...prev,
          [categoryId]: category.tools.map(t => t.name)
        }));
      }
    }
  };
  
  const handleOpenCategoryDetail = (categoryId: string) => {
    setExpandedCategory(categoryId);
  };
  
  const handleCloseCategoryDetail = () => {
    setExpandedCategory(null);
  };
  
  const handleToggleParentTool = (categoryId: string, parentToolName: string) => {
    setSelectedParentTools(prev => {
      const current = prev[categoryId] || [];
      const updated = current.includes(parentToolName)
        ? current.filter(name => name !== parentToolName)
        : [...current, parentToolName];
      
      return { ...prev, [categoryId]: updated };
    });
  };
  
  const handleSelectAllParents = (categoryId: string) => {
    const category = TOOL_CATEGORIES.find(c => c.id === categoryId);
    if (category) {
      setSelectedParentTools(prev => ({
        ...prev,
        [categoryId]: category.tools.map(t => t.name)
      }));
    }
  };
  
  const handleDeselectAllParents = (categoryId: string) => {
    setSelectedParentTools(prev => ({
      ...prev,
      [categoryId]: []
    }));
  };
  
  const handleSelectAll = () => {
    const allIds = TOOL_CATEGORIES.map(c => c.id);
    setSelectedCategories(allIds);
    
    // Auto-select all parent tools for each category
    const allParentTools: Record<string, string[]> = {};
    TOOL_CATEGORIES.forEach(category => {
      allParentTools[category.id] = category.tools.map(t => t.name);
    });
    setSelectedParentTools(allParentTools);
  };
  
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedParentTools({});
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
    
    // Filter categories that have selected parent tools
    const validCategories = TOOL_CATEGORIES.filter(c => {
      const isSelected = selectedCategories.includes(c.id);
      const hasSelectedParents = (selectedParentTools[c.id] || []).length > 0;
      return isSelected && hasSelectedParents;
    });
    
    if (validCategories.length === 0) {
      toast({
        title: "No parent tools selected",
        description: "Please select at least one parent tool from your selected categories.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDrawing(true);
    
    setTimeout(() => {
      const randomCategory = validCategories[
        Math.floor(Math.random() * validCategories.length)
      ];
      
      // Get only the selected parent tools for this category
      const availableParentToolNames = selectedParentTools[randomCategory.id] || [];
      const availableParentTools = randomCategory.tools.filter(t => 
        availableParentToolNames.includes(t.name)
      );
      
      const randomParentTool = availableParentTools[
        Math.floor(Math.random() * availableParentTools.length)
      ];
      
      // If the parent tool has children, randomly select one
      const randomChild = randomParentTool.children && randomParentTool.children.length > 0
        ? randomParentTool.children[Math.floor(Math.random() * randomParentTool.children.length)]
        : undefined;
      
      const scaleValue = randomCategory.hasScale 
        ? Math.floor(Math.random() * 10) + 1 
        : undefined;
      
      // Add unveiled value if enabled (1-10)
      const unveiledValue = isUnveiledEnabled 
        ? Math.floor(Math.random() * 10) + 1 
        : undefined;

      const drawnTool: DrawnTool = {
        id: `${Date.now()}-${Math.random()}`,
        categoryId: randomCategory.id,
        categoryName: randomCategory.name,
        parentToolName: randomParentTool.name,
        childToolName: randomChild,
        scaleValue,
        unveiledValue,
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
                onOpenDetail={handleOpenCategoryDetail}
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
            <div className="h-full overflow-y-auto pb-8 space-y-4">
              {/* Settings Controls */}
              <div className="bg-card border-2 border-primary/20 rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-bold text-primary mb-2">Draw Settings</h3>
                
                {/* Hierarchy Level Selector */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">Show Levels</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleLevel("cards")}
                      data-testid="button-level-cards"
                      className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-between ${
                        selectedLevels.includes("cards")
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span>Cards (Grandparents)</span>
                      {selectedLevels.includes("cards") && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => toggleLevel("tools")}
                      data-testid="button-level-tools"
                      className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-between ${
                        selectedLevels.includes("tools")
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span>Tools (Parents)</span>
                      {selectedLevels.includes("tools") && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => toggleLevel("examples")}
                      data-testid="button-level-examples"
                      className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-between ${
                        selectedLevels.includes("examples")
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span>Examples (Children)</span>
                      {selectedLevels.includes("examples") && <span className="text-xs">✓</span>}
                    </button>
                  </div>
                </div>

                {/* Unveiled Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Unveiled (1-10)</label>
                  <button
                    onClick={() => setIsUnveiledEnabled(!isUnveiledEnabled)}
                    data-testid="button-toggle-unveiled"
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      isUnveiledEnabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        isUnveiledEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

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
          selectedLevels={selectedLevels}
          onDrawAgain={handleDrawAgain}
          onClose={handleClose}
        />
      )}
      
      <CategoryDetailModal
        category={expandedCategory ? TOOL_CATEGORIES.find(c => c.id === expandedCategory) || null : null}
        isOpen={expandedCategory !== null}
        onClose={handleCloseCategoryDetail}
        selectedParentTools={selectedParentTools}
        onToggleParentTool={handleToggleParentTool}
        onSelectAll={handleSelectAllParents}
        onDeselectAll={handleDeselectAllParents}
      />
    </div>
  );
}
