import { DrawnTool } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { History, BookOpen } from "lucide-react";

interface HistoryPanelProps {
  history: DrawnTool[];
  onSelectTool?: (tool: DrawnTool) => void;
}

export default function HistoryPanel({ history, onSelectTool }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <Card className="p-6 border-2 border-primary/20 shadow-lg">
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-8">
          <History className="w-10 h-10 text-primary/60" />
          <p className="text-sm text-muted-foreground font-medium">
            No tools drawn yet. Start by selecting categories and drawing a tool!
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 border-2 border-primary/20 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-primary">Session History</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {history.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool?.(tool)}
              data-testid={`history-item-${index}`}
              className="w-full text-left p-4 rounded-xl border-2 border-primary/20 bg-card hover:border-accent hover:shadow-md active:scale-95 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-primary" data-testid={`text-tool-${index}`}>
                    {tool.parentToolName}
                    {tool.childToolName && (
                      <span className="text-accent ml-2 italic">"{tool.childToolName}"</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/20">
                      {tool.categoryName}
                    </Badge>
                    {tool.scaleValue !== undefined && (
                      <Badge variant="outline" className="text-xs border-accent text-accent-foreground bg-accent/10">
                        {tool.scaleValue}/10
                      </Badge>
                    )}
                    {tool.unveiledValue !== undefined && (
                      <Badge variant="outline" className="text-xs border-primary text-primary-foreground bg-primary/10">
                        Unveiled: {tool.unveiledValue}/10
                      </Badge>
                    )}
                    {tool.journalEntry && (
                      <Badge variant="outline" className="text-xs border-accent text-accent bg-accent/10 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Journal
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
