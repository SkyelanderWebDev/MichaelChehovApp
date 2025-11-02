import { ToolCategory, ParentTool } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";

interface CategoryDetailModalProps {
  category: ToolCategory | null;
  isOpen: boolean;
  onClose: () => void;
  selectedParentTools: Record<string, string[]>;
  onToggleParentTool: (categoryId: string, parentToolName: string) => void;
  onSelectAll: (categoryId: string) => void;
  onDeselectAll: (categoryId: string) => void;
}

export default function CategoryDetailModal({
  category,
  isOpen,
  onClose,
  selectedParentTools,
  onToggleParentTool,
  onSelectAll,
  onDeselectAll,
}: CategoryDetailModalProps) {
  if (!category) return null;

  const categorySelectedTools = selectedParentTools[category.id] || [];
  const allSelected = categorySelectedTools.length === category.tools.length;
  const someSelected = categorySelectedTools.length > 0 && !allSelected;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card border-4 border-accent">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary">
            {category.name}
          </DialogTitle>
          {category.description && (
            <DialogDescription className="text-base text-muted-foreground">
              {category.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectAll(category.id)}
            disabled={allSelected}
            data-testid="button-select-all-parents"
            className="border-2 border-primary/30"
          >
            <Check className="w-4 h-4 mr-2" />
            Select All Tools
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeselectAll(category.id)}
            disabled={categorySelectedTools.length === 0}
            data-testid="button-deselect-all-parents"
            className="border-2 border-primary/30"
          >
            <X className="w-4 h-4 mr-2" />
            Deselect All
          </Button>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {category.tools.map((parentTool: ParentTool, index: number) => {
              const isSelected = categorySelectedTools.includes(parentTool.name);
              const childrenCount = parentTool.children?.length || 0;

              return (
                <div
                  key={parentTool.name}
                  className={`
                    p-4 rounded-xl border-2 transition-all
                    ${isSelected 
                      ? 'border-accent bg-accent/10 shadow-md' 
                      : 'border-primary/20 bg-card hover:border-accent/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleParentTool(category.id, parentTool.name)}
                      data-testid={`checkbox-parent-${index}`}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg text-primary">
                          {parentTool.name}
                        </span>
                        {childrenCount > 0 && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-accent/20 text-accent-foreground border border-accent/40"
                          >
                            {childrenCount} {childrenCount === 1 ? 'child' : 'children'}
                          </Badge>
                        )}
                      </div>
                      {parentTool.children && parentTool.children.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {parentTool.children.map((child) => (
                            <Badge
                              key={child}
                              variant="outline"
                              className="text-xs border-primary/20 text-muted-foreground"
                            >
                              {child}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {categorySelectedTools.length === 0 ? (
              <span>No parent tools selected - category will be excluded from draw</span>
            ) : (
              <span className="font-semibold text-primary">
                {categorySelectedTools.length} of {category.tools.length} parent tools selected
              </span>
            )}
          </div>
          <Button onClick={onClose} data-testid="button-close-modal">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
