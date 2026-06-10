import HistoryPanel from "../HistoryPanel";
import { DrawnTool } from "@shared/schema";

export default function HistoryPanelExample() {
  const sampleHistory: DrawnTool[] = [
    {
      id: "1",
      categoryId: "tempo-rhythm",
      categoryName: "Tempo / Rhythm",
      parentToolName: "Staccato",
      childToolName: "Sharp",
      scaleValue: 7,
      timestamp: Date.now() - 120000,
    },
    {
      id: "2",
      categoryId: "expanding-contracting",
      categoryName: "Expanding & Contracting",
      parentToolName: "Expanding",
      childToolName: "Opening",
      timestamp: Date.now() - 300000,
    },
    {
      id: "3",
      categoryId: "imaginary-body",
      categoryName: "Imaginary Body",
      parentToolName: "Body Part",
      childToolName: "Head",
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
