import { useState } from "react";
import { DrawnTool } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, X, BookOpen } from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/toolData";
import FlybackModal from "./FlybackModal";

type HierarchyLevel = "cards" | "tools" | "examples";

interface ToolRevealCardProps {
  drawnTool: DrawnTool;
  selectedLevels: HierarchyLevel[];
  onDrawAgain: () => void;
  onClose: () => void;
  onSaveJournal: (journalEntry: string) => void;
}

export default function ToolRevealCard({ drawnTool, selectedLevels, onDrawAgain, onClose, onSaveJournal }: ToolRevealCardProps) {
  const [isFlybackOpen, setIsFlybackOpen] = useState(false);
  const category = TOOL_CATEGORIES.find(c => c.id === drawnTool.categoryId);
  const hasScale = category?.hasScale && drawnTool.scaleValue !== undefined;
  const hasUnveiled = drawnTool.unveiledValue !== undefined;
  
  // Show category badge only if cards level is selected and it's not the only thing shown
  const showCategoryBadge = selectedLevels.includes("cards") && selectedLevels.length > 1;
  const showCategoryAsMain = selectedLevels.includes("cards") && selectedLevels.length === 1;
  const showParentTool = selectedLevels.includes("tools") || (!selectedLevels.includes("cards") && !selectedLevels.includes("tools") && !selectedLevels.includes("examples"));
  const showChildTool = selectedLevels.includes("examples") && drawnTool.childToolName;
  
  return (
    <div 
      className="fixed inset-0 bg-primary/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
      data-testid="container-tool-reveal"
    >
      <Card className="w-full max-w-2xl min-h-96 p-12 rounded-3xl shadow-2xl relative animate-in zoom-in duration-500 bg-card border-4 border-accent">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 hover:bg-accent/20"
          onClick={onClose}
          data-testid="button-close-reveal"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <div className="flex flex-col items-center justify-center space-y-8 h-full">
          {showCategoryBadge && (
            <Badge variant="secondary" className="text-base px-4 py-1 bg-accent/20 text-accent-foreground border-2 border-accent" data-testid="badge-category">
              {drawnTool.categoryName}
            </Badge>
          )}
          
          {hasScale ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="relative w-56 h-56 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-8 border-accent/30"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-accent border-t-transparent"
                  style={{
                    transform: `rotate(${(drawnTool.scaleValue! / 10) * 360}deg)`,
                    transition: 'transform 0.5s ease-out'
                  }}
                ></div>
                <span className="text-7xl font-bold font-serif text-primary" data-testid="text-scale-value">
                  {drawnTool.scaleValue}
                </span>
              </div>
              
              {showCategoryAsMain && (
                <h1 className="text-5xl font-bold font-serif text-center text-primary" data-testid="text-tool-name">
                  {drawnTool.categoryName}
                </h1>
              )}
              {showParentTool && (
                <h1 className="text-5xl font-bold font-serif text-center text-primary" data-testid="text-tool-name">
                  {drawnTool.parentToolName}
                </h1>
              )}
              {showChildTool && (
                <p className="text-2xl text-accent font-semibold italic mt-2">
                  "{drawnTool.childToolName}"
                </p>
              )}
            </div>
          ) : (
            <>
              {showCategoryAsMain && (
                <h1 className="text-6xl font-bold font-serif text-center px-4 text-primary" data-testid="text-tool-name">
                  {drawnTool.categoryName}
                </h1>
              )}
              {showParentTool && (
                <h1 className="text-6xl font-bold font-serif text-center px-4 text-primary" data-testid="text-tool-name">
                  {drawnTool.parentToolName}
                </h1>
              )}
              {showChildTool && (
                <p className="text-3xl text-accent font-semibold italic mt-4">
                  "{drawnTool.childToolName}"
                </p>
              )}
            </>
          )}
          
          {hasUnveiled && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-2">Unveiled</p>
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-accent/30"></div>
                  <span className="text-3xl font-bold text-accent" data-testid="text-unveiled-value">
                    {drawnTool.unveiledValue}
                  </span>
                </div>
                <div className="flex flex-col text-xs text-muted-foreground">
                  <span>1 = Most Veiled</span>
                  <span>10 = Most Unveiled</span>
                </div>
              </div>
            </div>
          )}
          
          {category?.description && (
            <p className="text-muted-foreground text-center max-w-md text-lg">
              {category.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-3 pt-8 justify-center">
            <Button
              onClick={onDrawAgain}
              data-testid="button-draw-again"
              className="px-8 py-6 text-lg font-bold border-2 border-primary-border"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Draw Again
            </Button>
            <Button
              onClick={() => setIsFlybackOpen(true)}
              data-testid="button-flyback"
              className="px-8 py-6 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground border-2 border-accent-border"
              size="lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Flyback
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-testid="button-change-categories"
              className="px-8 py-6 text-lg font-semibold border-2 border-accent hover:bg-accent/10"
              size="lg"
            >
              Change Categories
            </Button>
          </div>
        </div>
      </Card>
      
      <FlybackModal
        isOpen={isFlybackOpen}
        onClose={() => setIsFlybackOpen(false)}
        onSave={onSaveJournal}
        initialValue={drawnTool.journalEntry || ""}
        toolName={drawnTool.parentToolName}
      />
    </div>
  );
}
