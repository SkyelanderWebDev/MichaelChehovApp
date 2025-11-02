import { DrawnTool } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, X } from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/toolData";

interface ToolRevealCardProps {
  drawnTool: DrawnTool;
  onDrawAgain: () => void;
  onClose: () => void;
}

export default function ToolRevealCard({ drawnTool, onDrawAgain, onClose }: ToolRevealCardProps) {
  const category = TOOL_CATEGORIES.find(c => c.id === drawnTool.categoryId);
  const hasScale = category?.hasScale && drawnTool.scaleValue !== undefined;
  
  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
      data-testid="container-tool-reveal"
    >
      <Card className="w-full max-w-2xl min-h-96 p-8 rounded-2xl shadow-2xl relative animate-in zoom-in duration-500">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
          data-testid="button-close-reveal"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <div className="flex flex-col items-center justify-center space-y-6 h-full">
          <Badge variant="secondary" className="text-sm" data-testid="badge-category">
            {drawnTool.categoryName}
          </Badge>
          
          {hasScale ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-8 border-primary/20"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent"
                  style={{
                    transform: `rotate(${(drawnTool.scaleValue! / 10) * 360}deg)`,
                    transition: 'transform 0.5s ease-out'
                  }}
                ></div>
                <span className="text-6xl font-bold font-serif text-primary" data-testid="text-scale-value">
                  {drawnTool.scaleValue}
                </span>
              </div>
              <h1 className="text-4xl font-bold font-serif text-center" data-testid="text-tool-name">
                {drawnTool.toolName}
              </h1>
            </div>
          ) : (
            <h1 className="text-5xl font-bold font-serif text-center px-4" data-testid="text-tool-name">
              {drawnTool.toolName}
            </h1>
          )}
          
          {category?.description && (
            <p className="text-muted-foreground text-center max-w-md">
              {category.description}
            </p>
          )}
          
          <div className="flex gap-4 pt-6">
            <Button
              onClick={onDrawAgain}
              data-testid="button-draw-again"
              className="px-8"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Draw Again
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-testid="button-change-categories"
            >
              Change Categories
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
