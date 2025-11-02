import { DrawnTool } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { History } from "lucide-react";

interface HistoryPanelProps {
  history: DrawnTool[];
  onSelectTool?: (tool: DrawnTool) => void;
}

export default function HistoryPanel({ history, onSelectTool }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-8">
          <History className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No tools drawn yet. Start by selecting categories and drawing a tool!
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Session History</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {history.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool?.(tool)}
              data-testid={`history-item-${index}`}
              className="w-full text-left p-4 rounded-lg border hover-elevate active-elevate-2 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate" data-testid={`text-tool-${index}`}>
                    {tool.toolName}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {tool.categoryName}
                    </Badge>
                    {tool.scaleValue !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        {tool.scaleValue}/10
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(tool.timestamp, { addSuffix: true })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
