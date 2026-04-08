import HistoryPanel from "../HistoryPanel";
import { DrawnTool } from "@shared/schema";

// TODO(claude): This example has multiple issues:
// 1. Uses "toolName" instead of "parentToolName" (doesn't match DrawnTool schema)
// 2. Missing required "parentToolName" field
// 3. categoryId "psychophysical" (line 16) doesn't exist — use real IDs from toolData.ts
// 4. categoryId "characterization" (line 23) is a family name, not a category ID
// Fix all sample data to match the DrawnTool type from shared/schema.ts
export default function HistoryPanelExample() {
  const sampleHistory: DrawnTool[] = [
    {
      id: "1",
      categoryId: "tempo-rhythm",
      categoryName: "Tempo / Rhythm",
      toolName: "Staccato",
      scaleValue: 7,
      timestamp: Date.now() - 120000,
    },
    {
      id: "2",
      categoryId: "psychophysical",
      categoryName: "PsychoPhysical Gestures",
      toolName: "Expansion and Contraction",
      timestamp: Date.now() - 300000,
    },
    {
      id: "3",
      categoryId: "characterization",
      categoryName: "Characterization",
      toolName: "Thinking",
      timestamp: Date.now() - 600000,
    },
  ];
  
  return (
    <div className="p-8 max-w-md">
      <HistoryPanel 
        history={sampleHistory}
        onSelectTool={(tool) => console.log('Selected tool:', tool)}
      />
    </div>
  );
}
