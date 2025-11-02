import { useState } from "react";
import DrawButton from "../DrawButton";

export default function DrawButtonExample() {
  const [isDrawing, setIsDrawing] = useState(false);
  
  const handleDraw = () => {
    console.log('Draw triggered');
    setIsDrawing(true);
    setTimeout(() => setIsDrawing(false), 2000);
  };
  
  return (
    <div className="p-8 flex flex-col gap-4 items-center">
      <DrawButton onClick={handleDraw} isDrawing={isDrawing} />
      <DrawButton onClick={() => {}} disabled />
    </div>
  );
}
