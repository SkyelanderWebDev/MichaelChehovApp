import ToolRevealCard from "../ToolRevealCard";
import { DrawnTool } from "@shared/schema";

export default function ToolRevealCardExample() {
  const sampleTool: DrawnTool = {
    id: "1",
    categoryId: "tempo-rhythm",
    categoryName: "Tempo / Rhythm",
    parentToolName: "Staccato",
    childToolName: "Sharp",
    scaleValue: 7,
    timestamp: Date.now(),
  };
  
  const sampleToolNoScale: DrawnTool = {
    id: "2",
    categoryId: "expanding-contracting",
    categoryName: "Expanding & Contracting",
    parentToolName: "Expanding",
    childToolName: "Opening",
    timestamp: Date.now(),
  };
  
  return (
    <div>
      <ToolRevealCard
        drawnTool={sampleTool}
        selectedLevels={["cards", "tools", "examples"]}
        onDrawAgain={() => console.log('Draw again')}
        onClose={() => console.log('Close')}
        onSaveJournal={(journalEntry) => console.log('Save journal:', journalEntry)}
      />
      <ToolRevealCard
        drawnTool={sampleToolNoScale}
        selectedLevels={["cards", "tools", "examples"]}
        onDrawAgain={() => console.log('Draw again')}
        onClose={() => console.log('Close')}
        onSaveJournal={(journalEntry) => console.log('Save journal:', journalEntry)}
      />
    </div>
  );
}
