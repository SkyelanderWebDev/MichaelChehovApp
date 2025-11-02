import ToolRevealCard from "../ToolRevealCard";
import { DrawnTool } from "@shared/schema";

export default function ToolRevealCardExample() {
  const sampleTool: DrawnTool = {
    id: "1",
    categoryId: "tempo-rhythm",
    categoryName: "Tempo / Rhythm",
    toolName: "Staccato",
    scaleValue: 7,
    timestamp: Date.now(),
  };
  
  const sampleToolNoScale: DrawnTool = {
    id: "2",
    categoryId: "psychophysical",
    categoryName: "PsychoPhysical Gestures",
    toolName: "Expansion and Contraction",
    timestamp: Date.now(),
  };
  
  return (
    <div>
      <ToolRevealCard
        drawnTool={sampleTool}
        onDrawAgain={() => console.log('Draw again')}
        onClose={() => console.log('Close')}
      />
    </div>
  );
}
